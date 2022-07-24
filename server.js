import express from 'express';
import Stripe from 'stripe';

import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

app.post('/payment', async (req, res) => {
   const amount = 2500;

   stripe.customers
      .create({
         email: req.body.stripeEmail,
         source: req.body.stripeToken,
      })
      .then((customer) => {
         //  console.log(customer);
         stripe.charges.create({
            amount,
            description: 'Website development Ebook',
            currency: 'usd',
            customer: customer.id,
         });
      })
      .then(() => res.redirect(`${process.env.REDIRECT_URL}/success.html`));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server up and running...'));
