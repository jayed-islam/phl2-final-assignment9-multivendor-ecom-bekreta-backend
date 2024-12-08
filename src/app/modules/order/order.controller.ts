import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { OrderServices } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const orderData = req.body;
  const order = await OrderServices.createOrder(orderData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order Created Successfully!',
    data: order,
  });
});

// const getAllOrders = catchAsync(async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;
//   const orders = await OrderServices.getOrders(Number(page), Number(limit));

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Orders retrieved Successfully!',
//     data: orders,
//   });
// });

const getAllOrders = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    startDate,
    endDate,
    searchTerm,
    status,
    district,
    sortBy,
  } = req.body;
  const { orders, pagination, meta } = await OrderServices.getAllOrdersForAdmin(
    Number(page),
    Number(limit),
    startDate as string,
    endDate as string,
    searchTerm as string,
    status as string,
    district as string,
    sortBy as 'latest' | 'oldest',
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Featured Orders retrieved Successfully!',
    data: { pagination, orders, meta },
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId, status } = req.body;
  const order = await OrderServices.updateOrderStatus(orderId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order Status Updated Successfully!',
    data: order,
  });
});

const getOrdersForUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { page = 1, limit = 10 } = req.body;
  const orders = await OrderServices.getOrdersByUserId(
    Number(page),
    Number(limit),
    userId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved Successfully!',
    data: orders,
  });
});

const getOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const order = await OrderServices.getOrderById(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order data retrieved Successfully!',
    data: order,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const orderData = req.body;
  const order = await OrderServices.updateOrder(orderId, orderData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order data updated Successfully!',
    data: order,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const order = await OrderServices.deleteOrder(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order deleted Successfully!',
    data: order,
  });
});

const orderSummary = catchAsync(async (req, res) => {
  const result = await OrderServices.getOrderSummaryForAdmin();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order summary reterieved Successfully!',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersForUser,
  updateOrderStatus,
  orderSummary,
};
