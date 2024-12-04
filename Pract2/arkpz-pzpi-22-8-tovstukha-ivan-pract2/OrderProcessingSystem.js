function calculateOrderTotal(order) {
  let subtotal = 0;
  for (let i = 0; i < order.items.length; i++) {
    subtotal += order.items[i].price * order.items[i].quantity;
  }

  const tax = subtotal * 0.15;

  let shippingCost = 0;
  if (order.items.length > 10) {
    shippingCost = 20;
  } else {
    shippingCost = 10;
  }

  return {
    subtotal: subtotal,
    tax: tax,
    shipping: shippingCost,
    total: subtotal + tax + shippingCost,
  };
}

function calculateBonus(order, isPremiumCustomer) {
  const isLargeOrder = order.totalAmount > 500;
  const isMediumOrder = order.totalAmount > 200;
  const isPremiumCustomerEligible = isPremiumCustomer;

  let bonusPercentage = 0;
  if (isLargeOrder) {
    bonusPercentage = isPremiumCustomerEligible ? 0.2 : 0.1;
  } else if (isMediumOrder) {
    bonusPercentage = 0.05;
  }

  const bonusAmount = order.totalAmount * bonusPercentage;
  return bonusAmount;
}

function calculateFinalPrice(order, isPremiumCustomer) {
  const orderDetails = calculateOrderTotal(order);

  const bonus = calculateBonus(
    { totalAmount: orderDetails.total },
    isPremiumCustomer
  );

  const priceAfterBonus = orderDetails.total - bonus;
  return {
    orderDetails,
    bonus,
    finalPrice: priceAfterBonus,
  };
}

const order = {
  items: [
    { price: 50, quantity: 5 },
    { price: 30, quantity: 2 },
    { price: 20, quantity: 1 },
  ],
};
const isPremiumCustomer = true;

const result = calculateFinalPrice(order, isPremiumCustomer);

console.log("Order details:", result.orderDetails);
console.log("Customer bonus:", result.bonus.toFixed(2));
console.log("Final price:", result.finalPrice.toFixed(2));
