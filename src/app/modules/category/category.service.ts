/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ICategory } from './category.interface';
import { Category } from './category.model';

// Create a new category
const createCategory = async (
  categoryData: ICategory,
  file: any,
): Promise<ICategory> => {
  if (!file || !file.path) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'A valid image file is required.',
    );
  }
  try {
    const existingCategory = await Category.findOne({
      $or: [{ name: categoryData.name }, { slug: categoryData.slug }],
    });

    if (existingCategory) {
      throw new AppError(
        httpStatus.CONFLICT,
        'A category with this name or slug already exists.',
      );
    }

    const category = await Category.create({
      ...categoryData,
      image: file.path,
    });
    return category;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw new AppError(httpStatus.CONFLICT, 'Server error');
  }
};

// Get all categories with optional filtering
const getAllCategories = async (): Promise<ICategory[]> => {
  try {
    const categories = await Category.find({ isDeleted: false });
    return categories;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw new AppError(httpStatus.CONFLICT, 'Server error');
  }
};

// Get all categories with optional filtering
const getAllCategoryFOrAdmin = async (): Promise<ICategory[]> => {
  try {
    const categories = await Category.find();
    return categories;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw new AppError(httpStatus.CONFLICT, 'Server error');
  }
};

// Get a single category by ID
const getCategoryById = async (
  categoryId: string,
): Promise<ICategory | null> => {
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  return category;
};

// Update a category by ID
const updateCategory = async (
  categoryId: string,
  updateData: Partial<ICategory>,
): Promise<ICategory | null> => {
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    updateData,
    { new: true, runValidators: true },
  );

  if (!updatedCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  return updatedCategory;
};

// Soft delete a category by ID
const deleteCategory = async (
  categoryId: string,
): Promise<ICategory | null> => {
  const deletedCategory = await Category.findOneAndUpdate(
    { _id: categoryId },
    { isDeleted: true },
    { new: true },
  );

  if (!deletedCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  return deletedCategory;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategoryFOrAdmin,
};
