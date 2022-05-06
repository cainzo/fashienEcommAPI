const router = require('express').Router();
const Stripe = require('stripe')
const stripe = Stripe('sk_test_51KwFgMIHdsf6ejiRAvaavjCeuc0UBx5g0uy7N726WhSf68J2N0AoolW9GO3T3vsOLB7cTBS83KqaqbdwfzcTqs5d00wngN9umH');

router.post("/payment", (req,res)=>{
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
    },(stripeErr, stripeRes)=>{
        if(stripeErr){
            res.status(500).json(stripeErr);
        }else{
            res.status(200).json(stripeRes)
        }
    })
})


module.exports = router;