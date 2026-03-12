const Stripe = require('stripe');
try {
  const stripe = new Stripe('mk_1T9hXqK7ziJu8AVDW0td9IX9');
  console.log("Success");
} catch (e) {
  console.log("Error:", e.message);
}
