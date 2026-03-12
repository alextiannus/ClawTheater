const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51T95MMK7ziJu8AVDxG53MQZre5jifJ7okslmzwuRz0DEulWSA315UVbyUQBoJjnMrKlgABpVRUWqa9RISl88jucX00svRvsfbx');

async function test() {
  try {
     const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{
            price_data: {currency: "usd", product_data: {name: "Test Chapter Unlock"}, unit_amount: 50},
            quantity: 1,
        }],
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel"
     });
     console.log("Success! Session URL:");
     console.log(session.url);
  } catch(e) {
     console.error("Error:", e.message);
  }
}
test();
