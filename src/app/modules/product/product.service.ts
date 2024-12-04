/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from './product.model';
import { IProduct } from './product.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import { Vendor } from '../vendor/vendor.model';
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

    // Create the new product
    const newProduct = await Product.create([productData], { session });

    await session.commitTransaction();
    session.endSession();

    return newProduct[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

const getProductsByCategoryIntoDB = async (category: string, limit: any) => {
  const products = await Product.find({ category, isDeleted: false })
    .limit(limit)
    .populate('category', 'name slug image')
    .populate('vendor')
    .populate('review');
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
) => {
  const query: Record<string, unknown> = {
    isDeleted: false,
  };

  if (category) {
    query.category = category;
  }

  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, 'i');
    query.$or = [
      { name: searchRegex },
      { about: searchRegex },
      { keywords: { $in: [searchRegex] } },
    ];
  }

  query.price = { $gte: minPrice, $lte: maxPrice };

  const countPromise = Product.countDocuments(query);

  const currentPage = Math.max(1, page);

  let productsPromise;
  if (typeof isLowestFirst === 'boolean') {
    const sortOptions: { [key: string]: SortOrder } = isLowestFirst
      ? { price: 1 }
      : { price: -1 };
    productsPromise = Product.find(query)
      .sort(sortOptions)
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .populate('category', 'name slug image')
      .populate('vendor')
      .populate('review');
  } else {
    productsPromise = Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'name slug image')
      .populate('vendor')
      .populate('review');
  }

  const [count, products] = await Promise.all([countPromise, productsPromise]);

  const totalPages = Math.ceil(count / limit);

  const pagination = {
    totalItems: count,
    totalPages: totalPages,
    currentPage: page,
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
    isDeleted: false,
    ...(vendorId && { vendor: vendorId }),
  };

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by search term
  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, 'i');
    query.$or = [
      { name: searchRegex },
      { about: searchRegex },
      { keywords: { $in: [searchRegex] } },
    ];
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
    .populate('review');

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

const getSingleProductByIdInToDB = async (id: string) => {
  const product = await Product.findById(id)
    .populate('category', 'name slug image')
    .populate('vendor')
    .populate('review');

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return product;
};

const updateProduct = async (
  id: string,
  productData: Partial<IProduct>,
  user: any,
) => {
  if (user.role !== 'admin') {
    const product = await Product.findById(id);

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // Check if the product belongs to the vendor associated with the user
    if (product.vendor.toString() !== user.vendor.toString()) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }
  }
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

const duplicateProduct = async (id: string, user: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingProduct = await Product.findById(id).session(session);
    if (!existingProduct) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    if (
      existingProduct.vendor.toString() !== user._id.toString() &&
      user.role !== 'admin'
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not allowed to duplicate this product',
      );
    }

    // Create a new product by copying details from the existing product
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
    const duplicatedProduct = await Product.create([newProductData], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return duplicatedProduct[0];
  } catch (error) {
    await session.abortTransaction(); // Rollback on error
    session.endSession();
    console.error(error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Server error');
  }
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
};
