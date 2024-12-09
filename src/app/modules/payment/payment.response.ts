export const htmlPaymentSuccessContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Payment Successful</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4CAF50;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      line-height: 1.6;
    }
    .content h2 {
      color: #333;
    }
    .btn-home {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      color: white;
      background-color: #4CAF50;
      text-decoration: none;
      border-radius: 5px;
      text-align: center;
    }
    .btn-home:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Payment Successful
    </div>
    <div class="content">
      <h2>Thank you for your purchase!</h2>
      <p>Your payment has been successfully processed. Your order is now being prepared for shipment.</p>
      <p>Order details and tracking information can be found under "My Orders" in your account.</p>
      <p>If you have any questions about your order, feel free to contact our support team.</p>
      <a href="https://yourwebsite.com/orders" target="_blank" class="btn-home">View My Orders</a>
    </div>
  </div>
</body>
</html>
`;

export const htmlPaymentFailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Payment Failed</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #e74c3c;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      line-height: 1.6;
    }
    .content h2 {
      color: #333;
    }
    .btn-home {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      color: white;
      background-color: #e74c3c;
      text-decoration: none;
      border-radius: 5px;
      text-align: center;
    }
    .btn-home:hover {
      background-color: #d43f33;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Payment Failed
    </div>
    <div class="content">
      <h2>Oops! Your payment was not successful.</h2>
      <p>Unfortunately, your payment could not be processed. Please try again or use a different payment method.</p>
      <p>If you need help, feel free to contact our support team.</p>
      <a href="https://yourwebsite.com/support" target="_blank" class="btn-home">Contact Support</a>
    </div>
  </div>
</body>
</html>
`;
