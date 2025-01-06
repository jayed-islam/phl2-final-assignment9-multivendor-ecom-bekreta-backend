/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder, startSession } from 'mongoose';
import { IOrder } from './order.interface';
import { Product } from '../product/product.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { startOfToday, subDays } from 'date-fns';
import { Order } from './order.model';
import { PaymentService } from '../payment/payment.service';
import { Category } from '../category/category.model';

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
    // (userId: string, vendor: string, order: string, amount: number)
    // name?: string, address?: string, phone?: string
    if (orderData.paymentMethod === 'aamarpay') {
      const paymentResponse = await PaymentService.makePayment(
        order.user as any,
        order.vendor as any,
        order._id,
        order.totalPrice,
        order.name,
        order.address,
        order.phone,
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Return the payment response
      return paymentResponse;
    }

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
  vendorId: string,
  startDate?: string,
  endDate?: string,
  searchTerm?: string,
  status?: string,
  sortBy?: 'latest' | 'oldest',
) => {
  const query: any = {
    ...(vendorId && {
      vendor: vendorId,
    }),
  };

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

  const sort: { [key: string]: SortOrder } =
    sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  // Fetch orders and total count with pagination and filters
  const countPromise = Order.countDocuments(query);
  const productsPromise = Order.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: 'items.product',
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
    Order.countDocuments({ user: userId }),
    // Fetch paginated orders
    Order.find({ user: userId })
      .populate({
        path: 'items.product',
        model: 'Product',
      })
      .populate('vendor')
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

const getSummary = async (vendor?: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7);

    // Fetch last week's orders (paginated)
    const lastWeekOrders = await Order.find({
      ...(vendor && { vendor }),
      createdAt: { $gte: lastWeekStart, $lt: today },
    })
      .sort({ createdAt: -1 })
      .limit(15)
      .session(session);

    // Revenue in the last week
    const lastWeekRevenue = await Order.aggregate([
      {
        $match: {
          ...(vendor && { vendor }), // Add vendor filter if provided
          paymentStatus: 'paid',
          createdAt: {
            $gte: lastWeekStart,
            $lt: today,
          },
        },
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      },
    ]).session(session);

    // Total products count
    const productsCount = await Product.countDocuments({
      ...(vendor && { vendor }), // Add vendor filter if provided
    }).session(session);

    // Weekly sales data
    const salesOverviewRaw = await Order.aggregate([
      {
        $match: {
          ...(vendor && { vendor }), // Add vendor filter if provided
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          totalSales: { $sum: '$totalPrice' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).session(session);

    const salesOverview = Array.from({ length: 7 }, (_, i) => {
      const day = i + 1; // Day of week (1=Sunday, 7=Saturday)
      const data = salesOverviewRaw.find((item: any) => item._id === day);
      return {
        day,
        totalSales: data ? data.totalSales : 0,
      };
    });

    // Category distribution
    const categoryDistributionRaw = await Product.aggregate([
      {
        $match: {
          ...(vendor && { vendor }), // Add vendor filter if provided
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]).session(session);

    const categories = await Category.find({
      _id: { $in: categoryDistributionRaw.map((item: any) => item._id) },
    }).session(session);

    const categoryDistribution = categoryDistributionRaw.map((item: any) => {
      const category = categories.find(
        (cat: any) => cat._id.toString() === item._id.toString(),
      );
      return {
        category: category ? category.name : 'Unknown',
        count: item.count,
      };
    });

    // Prepare summary and chart data
    const summary = {
      orders: lastWeekOrders.length,
      revenue: lastWeekRevenue[0]?.total || 0,
      products: productsCount,
    };

    const chartData = {
      salesOverview,
      categoryDistribution,
    };

    await session.commitTransaction();
    session.endSession();

    return {
      summary,
      chartData,
      lastWeekOrders,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
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
  getSummary,
};
