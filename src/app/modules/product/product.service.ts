/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from './product.model';
import { IProduct } from './product.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import { Vendor } from '../vendor/vendor.model';
import { User } from '../user/user.model';
// eslint-disable-next-line @typescript-eslint/no-explicit-any

const createProduct = async (productData: IProduct, files: any[]) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const vendor = await Vendor.findById(productData.vendor);
    if (!vendor) {
      throw new AppError(httpStatus.NOT_FOUND, 'Vendor not found');
    }

    if (vendor.isBlacklisted) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Vendor is blacklisted, cannot create products',
      );
    }

    const existingProduct = await Product.findOne({ name: productData.name });
    if (existingProduct) {
      throw new AppError(
        httpStatus.CONFLICT,
        'A product with this name already exists',
      );
    }

    // // Handle product images
    if (files && files.length > 0) {
      const paths = files.map((file) => file.path);
      productData.images = paths;
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'At least one image is required',
      );
    }

    const newProduct = await Product.create([productData], { session });

    vendor.products.push(newProduct[0]._id);

    await vendor.save({ session });

    await session.commitTransaction();
    session.endSession();

    return newProduct[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error?.message || 'Server error',
    );
  }
};

const getProductsByCategoryIntoDB = async (category: string, limit: any) => {
  const products = await Product.find({ category, isDeleted: false })
    .limit(limit)
    .populate('category', 'name slug image')
    .populate('vendor')
    .populate('reviews');
  return products;
};

export const getProductList = async (
  searchTerm: string,
  category: string,
  page: number,
  limit: number,
  minPrice: number = 0,
  maxPrice: number = Number.MAX_SAFE_INTEGER,
  isLowestFirst?: boolean,
  userId?: string,
  ratings?: string[],
  status?: string[],
) => {
  // Build the base query
  const query: Record<string, unknown> = {
    isDeleted: false,
    isPublished: true,
    price: { $gte: minPrice, $lte: maxPrice },
  };

  if (category) {
    query.category = category;
  }

  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, 'i');
    query.$or = [{ name: searchRegex }, { description: searchRegex }];
  }

  if (ratings && ratings.length > 0) {
    query.rating = { $in: ratings.map((rating) => Number(rating)) };
  }

  if (status && status.length > 0) {
    query.status = { $in: status };
  }

  // Get followed vendors if userId is provided
  let followedVendors: string[] = [];
  if (userId) {
    const user = await User.findById(userId).select('followedVendors');
    followedVendors = (user?.followedVendors || []).map((vendorId) =>
      vendorId.toString(),
    );
  }

  // Pagination
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * limit;

  // Sorting logic
  const sortOptions: Record<string, SortOrder> = {};
  if (typeof isLowestFirst === 'boolean') {
    sortOptions.price = isLowestFirst ? 1 : -1;
  }
  sortOptions.createdAt = -1; // Default sort by newest products

  // Fetch products
  let products: any[] = [];

  if (followedVendors.length > 0) {
    // Separate query for followed vendors
    const followedVendorProducts = await Product.find({
      ...query,
      vendor: { $in: followedVendors },
    })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const otherProducts = await Product.find({
      ...query,
      vendor: { $nin: followedVendors },
    })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Combine the two arrays
    products = [...followedVendorProducts, ...otherProducts];
  } else {
    products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
  }

  // Fetch total count for pagination
  const count = await Product.countDocuments(query);

  const totalPages = Math.ceil(count / limit);

  // Prepare pagination data
  const pagination = {
    totalItems: count,
    totalPages,
    currentPage,
    itemsPerPage: limit,
  };

  return { products, pagination };
};

const getProductListForAdmin = async (
  searchTerm: string,
  category: string,
  page: number,
  limit: number,
  isLowestFirst: boolean,
  isOldestFirst: boolean = false,
  vendorId: string,
) => {
  const query: Record<string, unknown> = {
    ...(vendorId && { vendor: new mongoose.Types.ObjectId(vendorId) }),
    ...(vendorId && { isDeleted: false }),
  };

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by search term
  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, 'i');
    query.$or = [{ name: searchRegex }, { description: searchRegex }];
  }

  // Initialize the sorting options
  const sortOptions: { [key: string]: SortOrder } = {};

  // Apply price-based sorting
  if (typeof isLowestFirst === 'boolean') {
    sortOptions.price = isLowestFirst ? 1 : -1;
  }

  if (isOldestFirst) {
    sortOptions.createdAt = 1;
  } else {
    sortOptions.createdAt = -1;
  }

  // Fetch count and products in parallel
  const countPromise = Product.countDocuments(query);
  const productsPromise = Product.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('category', 'name slug image')
    .populate('vendor')
    .populate('reviews');

  const [count, products] = await Promise.all([countPromise, productsPromise]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(count / limit);

  const pagination = {
    totalItems: count,
    totalPages: totalPages,
    currentPage: page,
    itemsPerPage: limit,
  };

  return { products, pagination };
};

// const getSingleProductByIdInToDB = async (id: string) => {
//   const product = await Product.findById(id)
//     .populate('category', 'name slug image')
//     .populate('vendor')
//     .populate('review');

//   if (!product) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
//   }

//   return product;
// };

const getSingleProductByIdInToDB = async (id: string) => {
  const product = await Product.findById(id)
    .populate('category', 'name slug image')
    .populate('vendor')
    .populate('reviews')
    .populate({
      path: 'reviews',
      populate: [{ path: 'customer', select: 'name email profilePicture' }],
    });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const relatedProducts = await Product.find({
    category: product.category._id,
    _id: { $ne: id },
    isDeleted: false,
    isPublished: true,
  }).limit(5);

  return {
    product,
    relatedProducts,
  };
};

const getFlashSaleProductsFromDB = async () => {
  try {
    const products = await Product.find({
      isOnSale: true,
      isDeleted: false,
      isPublished: true,
    })
      .populate('category', 'name slug image')
      .limit(15)
      .exec();

    return products;
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateProduct = async (id: string, productData: Partial<IProduct>) => {
  // if (user.role !== 'admin') {
  //   const product = await Product.findById(id);

  //   if (!product) {
  //     throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  //   }

  //   // Check if the product belongs to the vendor associated with the user
  //   if (product.vendor.toString() !== user.vendor.toString()) {
  //     throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
  //   }
  // }
  console.log('ddd', productData);
  const product = await Product.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  });
  return product;
};

const softDeleteProduct = async (id: string) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return product;
};

const getAllProducts = async () => {
  const products = await Product.find({
    isDeleted: false,
    isPublished: true,
  })
    .populate('category')
    .populate('vendor');
  return products;
};

const duplicateProduct = async (id: string) => {
  try {
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    const newProductData = {
      ...existingProduct.toObject(),
      name: `${existingProduct.name} - Copy`,
      vendor: existingProduct.vendor,
      reviews: [],
      createdAt: undefined,
      updatedAt: undefined,
    };

    delete newProductData._id;

    // Create the duplicated product
    const duplicatedProduct = await Product.create(newProductData);

    return duplicatedProduct;
  } catch (error) {
    console.error(error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

const getHomeData = async () => {
  const bestSellingProductPromise = Product.find({ isDeleted: false })
    .sort({ salesCount: -1 })
    .limit(6)
    .populate('category', 'name slug image')
    .exec();

  const flashSaleProductsPromise = Product.find({
    isOnSale: true,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('category', 'name slug image')
    .exec();

  const offerProductsPromise = Product.find({
    status: 'OFFERED',
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('category', 'name slug image')
    .exec();

  const newArrivalProductsPromise = Product.find({
    status: 'NEW_ARRIVAL',
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('category', 'name slug image')
    .exec();

  // Resolve all promises in parallel
  const [
    bestSellingProduct,
    flashSaleProducts,
    offerProducts,
    newArrivalProducts,
  ] = await Promise.all([
    bestSellingProductPromise,
    flashSaleProductsPromise,
    offerProductsPromise,
    newArrivalProductsPromise,
  ]);

  return {
    flashSaleProducts,
    bestSellingProduct,
    offerProducts,
    newArrivalProducts,
  };
};

export const ProductServices = {
  createProduct,
  getProductsByCategoryIntoDB,
  getSingleProductByIdInToDB,
  getProductList,
  updateProduct,
  softDeleteProduct,
  getProductListForAdmin,
  duplicateProduct,
  getFlashSaleProductsFromDB,
  getAllProducts,
  getHomeData,
};
