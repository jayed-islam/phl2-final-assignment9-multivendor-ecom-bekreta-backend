import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ProductServices } from './product.service';

const createProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const files = req.files as any[];
  const product = await ProductServices.createProduct(productData, files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Created Successfully!',
    data: product,
  });
});

const getProductList = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    category,
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    isLowestFirst,
  } = req.body;

  const { products, pagination } = await ProductServices.getProductList(
    searchTerm as string,
    category as string,
    Number(page),
    Number(limit),
    Number(minPrice),
    Number(maxPrice),
    isLowestFirst,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retitrived Successfully!',
    data: {
      products,
      pagination,
    },
  });
});

const getProductListForAdmin = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    category,
    isLowestFirst,
    isOldestFirst,
    vendorId,
  } = req.body;

  const { products, pagination } = await ProductServices.getProductListForAdmin(
    searchTerm as string,
    category as string,
    Number(page),
    Number(limit),
    isLowestFirst,
    isOldestFirst,
    vendorId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retitrived Successfully!',
    data: {
      products,
      pagination,
    },
  });
});

const getSingleProductByID = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const product = await ProductServices.getSingleProductByIdInToDB(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product data rectrived Successfully!',
    data: product,
  });
});

const getProductByCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const { limit } = req.query;
  const product = await ProductServices.getProductsByCategoryIntoDB(
    categoryId,
    limit,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category wise product data rectrived Successfully!',
    data: product,
  });
});

const updateSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  const product = await ProductServices.updateProduct(
    id,
    productData,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product data updated Successfully!',
    data: product,
  });
});

const softDeleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await ProductServices.softDeleteProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted Successfully!',
    data: product,
  });
});

export const ProductController = {
  createProduct,
  getProductList,
  getSingleProductByID,
  updateSingleProduct,
  softDeleteProduct,
  getProductByCategory,
  getProductListForAdmin,
};
