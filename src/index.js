const express =require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const app = express();
const {products} = require('./data');
const key_id = 'rzp_test_BrGC45KByyNTtr';
const key_secret = "9akpTyZy2Lqk3FnbewgIQj0K";

const instance = new Razorpay({
    key_id,
    key_secret,
  });

app.use(cors());
app.use(express.json());
app.get('/products', (req,res)=>{
    res.status(200).json(products);
});

app.get("/order/:productId", (req,res) => {
    const {productId} = req.params;
    const product = products.find(product =>product.id == productId);
    const amount = product.price*100*70;
    const currency = "INR";
    const receipt = 'receipt#123';
    const notes = {desc:product.description};
    instance.orders.create({amount,currency,receipt,notes},(error,order)=>{
        if(error){
            return res.status(500).json(error);
        }
        return res.status(200).json(order);

    });
});

app.post("/verify/razorpay-signature",(req,res)=>{
    console.log(JSON.stringify(req.body));
    const crypto = require('crypto');
    const hash = crypto.createHmac('SHA256', "123456789").update(JSON.stringify(req.body)).digest('hex');
    console.log(hash);
    console.log(req.headers['x-razorpay-signature']);
    if(hash === req.headers['x-razorpay-signature'] ){

    }else{
        
    }
    res.status(200);

});

app.listen(8000, ()=>{
    console.log('Server Listening on port' + 8000)
});