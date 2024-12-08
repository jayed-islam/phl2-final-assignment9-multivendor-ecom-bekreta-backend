/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder, startSession } from 'mongoose';
import { IOrder } from './order.interface';
import { Product } from '../product/product.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { startOfToday, subDays } from 'date-fns';
import { Order } from './order.model';

// const createOrder = async (orderData: IOrder) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Fetch the user's cart with product details
//     const cart = await Cart.findOne({ userId: orderData.userId })
//       .populate('products.product')
//       .session(session);
//     if (!cart || cart.products.length === 0) {
//       throw new Error('Cart is empty');
//     }

//     // Check product availability and calculate total price
//     let totalPrice = 0;
//     const productUpdates = cart.products.map(async (item) => {
//       const product = await Product.findById(item.product).session(session);
//       if (!product || product.stock < item.quantity) {
//         throw new Error(`Product ${product!.name} is out of stock`);
//       }
//       totalPrice += product.price * item.quantity;
//       product.stock -= item.quantity;
//       return await product.save({ session });
//     });

//     await Promise.all(productUpdates);

//     // Create the order
//     const order = new Order({
//       userId: orderData.userId,
//       products: cart.products.map((item) => ({
//         product: item.product._id,
//         quantity: item.quantity,
//       })),
//       totalPrice,
//       status: 'pending',
//     });

//     await order.save({ session });

//     // Clear the cart
//     await Cart.findOneAndDelete({}).session(session);

//     await session.commitTransaction();
//     session.endSession();

//     return order;
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

// const createOrder = async (orderData: IOrder) => {
//   const { products } = orderData;
//   const session = await startSession();
//   session.startTransaction();

//   try {
//     // Fetch the user's cart
//     const cart = await Cart.findOne({ userId: orderData.userId }).session(
//       session,
//     );
//     if (!cart || cart.products.length === 0) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Your Cart is empty');
//     }

//     console.log('cart', cart);

//     // Filter selected items from the cart
//     const selectedItems = cart.products.filter((item) =>
//       products.some(
//         (productItem) =>
//           productItem.product.toString() === item.product.toString(),
//       ),
//     );

//     if (selectedItems.length === 0) {
//       throw new AppError(
//         httpStatus.NOT_FOUND,
//         'Selected items are not found in the cart',
//       );
//     }

//     console.log('select', selectedItems);

//     // Check product availability and calculate total price
//     let totalPrice = 0;
//     const orderItems = await Promise.all(
//       selectedItems.map(async (item) => {
//         console.log('ii', item);
//         const selectedItem = products.find(
//           (product) => product.product.toString() === item.product.toString(),
//         );
//         console.log('item', selectedItem);
//         if (selectedItem) {
//           const product = await Product.findById(item.product._id).session(
//             session,
//           );
//           if (!product || product.stock < selectedItem.quantity) {
//             throw new AppError(
//               httpStatus.NOT_FOUND,
//               `Product ${product?.name || 'Unknown'} is out of stock`,
//             );
//           }
//           totalPrice += product.price * selectedItem.quantity;
//           product.stock -= selectedItem.quantity;
//           await product.save({ session });
//           return {
//             product: product._id,
//             quantity: selectedItem.quantity,
//             price: product.price,
//           };
//         }
//         return null;
//       }),
//     );

//     console.log('order', orderItems, totalPrice);

//     // Create the order
//     const order = new Order({
//       ...orderData,
//       products: orderItems.filter(Boolean),
//       totalPrice,
//     });

//     await order.save({ session });

//     // Remove selected items from the cart
//     cart.products = cart.products.filter(
//       (item) =>
//         !products.some((product) => product.product === item.product._id),
//     );
//     await cart.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     return order;
//   } catch (error: any) {
//     await session.abortTransaction();
//     session.endSession();
//     throw new AppError(httpStatus.CONFLICT, error.message);
//   }
// };

// const createOrder = async (orderData: IOrder, user: any) => {
//   const { products, userId } = orderData;
//   const session = await startSession();
//   session.startTransaction();

//   try {
//     if (userId !== user._id.toString()) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'User ID does not match');
//     }
//     // Fetch the user's cart
//     const cart = await Cart.findOne({ userId: orderData.userId }).session(
//       session,
//     );
//     if (!cart || cart.products.length === 0) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Your Cart is empty');
//     }

//     console.log('cart', cart);
//     console.log('order', products);
//     console.log('userId', userId);
//     console.log('_id', user._id);

//     // Filter selected items from the cart
//     const selectedItems = cart.products.filter((item) =>
//       products.some(
//         (productItem) =>
//           productItem.product.toString() === item.product.toString(),
//       ),
//     );

//     if (selectedItems.length === 0) {
//       throw new AppError(
//         httpStatus.NOT_FOUND,
//         'Selected items are not found in the cart',
//       );
//     }

//     console.log('select', selectedItems);

//     // Check product availability and calculate total price
//     let totalPrice = 0;
//     const orderItems = await Promise.all(
//       selectedItems.map(async (item) => {
//         const selectedItem = products.find(
//           (product) => product.product.toString() === item.product.toString(),
//         );

//         if (selectedItem) {
//           const product = await Product.findById(item.product._id).session(
//             session,
//           );
//           if (!product || product.stock < selectedItem.quantity) {
//             throw new AppError(
//               httpStatus.NOT_FOUND,
//               `Product ${product?.name || 'Unknown'} is out of stock`,
//             );
//           }
//           totalPrice += product.price * selectedItem.quantity;
//           product.stock -= selectedItem.quantity;
//           await product.save({ session });
//           return {
//             product: product._id,
//             quantity: selectedItem.quantity,
//             price: product.price,
//           };
//         }
//         return null;
//       }),
//     );

//     console.log('order', orderItems, totalPrice);

//     // Create the order
//     const order = new Order({
//       ...orderData,
//       products: orderItems.filter(Boolean),
//       totalPrice,
//     });

//     await order.save({ session });

//     // Remove selected items from the cart
//     cart.products = cart.products.filter(
//       (item) =>
//         !products.some(
//           (product) => product.product.toString() === item.product.toString(),
//         ),
//     );
//     await cart.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     return order;
//   } catch (error: any) {
//     await session.abortTransaction();
//     session.endSession();
//     throw new AppError(httpStatus.CONFLICT, error.message);
//   }
// };

// const getOrders = async (page: number, limit: number): Promise<IOrder[]> => {
//   const orders = await Order.find()
//     .skip((page - 1) * limit)
//     .limit(limit);
//   return orders;
// };

const createOrder = async (orderData: IOrder) => {
  const session = await startSession();
  session.startTransaction();

  try {
    // Fetch products from the database
    const productsInDb = await Product.find({
      _id: { $in: orderData.items.map((product) => product.product) },
    }).session(session);

    // Create a map for easy access to product data
    const productMap = new Map(
      productsInDb.map((product) => [product._id.toString(), product]),
    );

    // Validate product availability and calculate total price concurrently
    const orderItems = await Promise.all(
      orderData.items.map(async (orderedItem) => {
        const productInDb = productMap.get(orderedItem.product.toString());

        // Check if the product exists and if there is enough stock
        if (!productInDb || productInDb.inventoryCount < orderedItem.quantity) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            `Product ${productInDb?.name || 'Unknown'} is out of stock`,
          );
        }

        // Calculate the price for the ordered item
        const itemTotalPrice = productInDb.price * orderedItem.quantity;

        // Update the product's stock
        productInDb.inventoryCount -= orderedItem.quantity;
        await productInDb.save({ session });

        return {
          product: productInDb._id,
          quantity: orderedItem.quantity,
          price: productInDb.price,
          totalPrice: itemTotalPrice,
          // ...(orderedItem.productColor && {
          //   productColor: orderedItem.productColor,
          // }),
          // ...(orderedItem.productSize && {
          //   productSize: orderedItem.productSize,
          // }),
        };
      }),
    );

    // Calculate the total price for the products
    const productTotalPrice = orderItems.reduce(
      (total, item) => total + item.totalPrice,
      0,
    );

    // Add the delivery charge to the total price
    const totalPrice = productTotalPrice + orderData.deliveryCharge;

    // Create the order
    const order = new Order({
      ...orderData,
      items: orderItems,
      totalPrice,
    });

    await order.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.CONFLICT, error.message);
  }
};

const getAllOrdersForAdmin = async (
  page: number,
  limit: number,
  startDate?: string,
  endDate?: string,
  searchTerm?: string,
  status?: string,
  district?: string,
  sortBy?: 'latest' | 'oldest',
) => {
  const query: any = {};

  // Filter by date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = startDate;
    }
    if (endDate) {
      query.createdAt.$lte = endDate;
    }
  }

  // Search by name, phone, or _id using searchTerm
  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, 'i');
    query.$or = [
      { name: searchRegex },
      { phone: searchRegex },
      { _id: searchRegex },
    ];
  }

  // Filter by order status
  if (status) {
    query.status = status;
  }

  // Regex search by district
  if (district) {
    query.district = { $regex: district, $options: 'i' };
  }

  const sort: { [key: string]: SortOrder } =
    sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  // Fetch orders and total count with pagination and filters
  const countPromise = Order.countDocuments(query);
  const productsPromise = Order.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: 'products.product',
      model: 'Product',
    });

  const statusCountsPromise = Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const [count, orders, statusCounts] = await Promise.all([
    countPromise,
    productsPromise,
    statusCountsPromise,
  ]);

  // Calculate pagination details
  const totalPages = Math.ceil(count / limit);
  const pagination = {
    totalItems: count,
    totalPages: totalPages,
    currentPage: page,
    itemsPerPage: limit,
  };
  // Initialize all statuses with 0
  const initialStatusCounts = {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  // Update the counts based on the actual data
  const statusMetadata = statusCounts.reduce((acc: any, statusCount: any) => {
    acc[statusCount._id] = statusCount.count;
    return acc;
  }, initialStatusCounts); // Start with the initial object

  // Return orders with pagination
  return { orders, pagination, meta: statusMetadata };
};

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    // Validate the new status
    const validStatuses = [
      'pending',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(newStatus)) {
      throw new Error('Invalid status');
    }

    // Update the order status in the database
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true },
    );

    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    return updatedOrder;
  } catch (error: any) {
    console.error('Error updating order status:', error);
    throw new AppError(
      httpStatus.NOT_FOUND,
      error.message || 'Failed to update order status',
    );
  }
};
const getOrdersByUserId = async (
  page: number,
  limit: number,
  userId: string,
) => {
  // const orders = await Order.find({ userId })
  //   .populate({
  //     path: 'products.product',
  //     model: 'Product',
  //   })
  //   .sort({ createdAt: -1 })
  //   .skip((page - 1) * limit)
  //   .limit(limit);
  const [totalItems, orders] = await Promise.all([
    // Count total items
    Order.countDocuments({ userId }),
    // Fetch paginated orders
    Order.find({ userId })
      .populate({
        path: 'products.product',
        model: 'Product',
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / limit);

  const pagination = {
    totalItems,
    totalPages,
    currentPage: page,
    itemPerPage: limit,
  };

  return {
    orders,
    pagination,
  };
};

const getOrderById = async (orderId: string): Promise<IOrder | null> => {
  const order = await Order.findById(orderId)
    .populate({
      path: 'products.product',
    })
    .exec();
  return order;
};

const updateOrder = async (
  orderId: string,
  orderData: Partial<IOrder>,
): Promise<IOrder | null> => {
  const currentOrder = await Order.findById(orderId);
  if (!currentOrder) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const order = await Order.findByIdAndUpdate(orderId, orderData, {
    new: true,
  });
  return order;
};

const deleteOrder = async (orderId: string): Promise<IOrder | null> => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status: 'cancelled' },
    { new: true },
  );
  return order;
};

const getOrderSummaryForAdmin = async () => {
  console.log('hee');
  try {
    const today = startOfToday(); // Get the start of today
    const lastWeekStart = subDays(today, 7); // Start date for the previous week

    // Count today's orders
    const todayOrdersCount = await Order.countDocuments({
      createdAt: {
        $gte: today, // Only orders created from today onwards
      },
    });

    // Count total pending orders
    const totalPendingOrders = await Order.countDocuments({
      status: 'pending',
    });

    // Count total delivered orders
    const totalDeliveredOrders = await Order.countDocuments({
      status: 'delivered',
    });

    // Count orders from the last week
    const lastWeekOrdersCount = await Order.countDocuments({
      createdAt: {
        $gte: lastWeekStart, // Orders created in the last week
        $lt: today, // Up to the start of today
      },
    });

    // Fetch total revenue for today
    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today, // Only today's orders
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    // Fetch total revenue for the last week
    const lastWeekRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastWeekStart, // Orders created in the last week
            $lt: today, // Up to the start of today
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    return {
      todayOrdersCount,
      totalPendingOrders,
      totalDeliveredOrders,
      lastWeekOrdersCount,
      todayRevenue: todayRevenue[0]?.totalRevenue || 0,
      lastWeekRevenue: lastWeekRevenue[0]?.totalRevenue || 0,
    };
  } catch (error: any) {
    console.log(error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve order summary',
    );
  }
};

export const OrderServices = {
  createOrder,
  getAllOrdersForAdmin,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
  updateOrderStatus,
  getOrderSummaryForAdmin,
};
