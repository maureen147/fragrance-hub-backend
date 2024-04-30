import { connectDb } from "./src/db.config.js";
import dotenv from 'dotenv';
import  express  from "express";
import  authRouter  from './src/routes/auth.js';
import  categoryRouter  from "./src/routes/category.js";
import productRouter from "./src/routes/product.js"
import orderRouter from "./src/routes/order.js"
import {ratingRouter} from "./src/routes/rating.js"
import cors from 'cors'

dotenv.config();

// initialize express server
const app = express();
// middlewares
app.use(express.json());

let corsOptions = { 
    origin : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', "https://fragrance-hub.vercel.app" ], 
  } 
  app.use(cors(corsOptions));


const port = process.env.PORT
const dbUrl = process.env.MONGODB_URL 
// console.log(port);
console.log(dbUrl);
// connect to DB
connectDb(dbUrl);

app.get('/', (req, res) =>{
    res.json({success: true, message: 'OK'});
    ;
})

app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/v1/rating", ratingRouter)

app.use("/api/product", productRouter);
app.use("/api/order",orderRouter );
app.listen(port, (req, res) =>{
    console.log(`Fragrance Hub Server listening on ${port}`);
});









// import {connectDB} from'./src/db.config.js';
// import dotenv from "dotenv";
// import express  from "express"
// import authRouter from './src/routes/auth.js'
// import categoryRouter from './src/routes/category.js'
// import productRouter from './src/routes/product.js'

// dotenv.config()

// //initialise expressserver
// const app = express();
// app.use(express.json());

// const port =process.env.PORT 
// const dbUrl=process.env.MONGODB_URL
// // console.log(port);
// // console.log(dbUrl);

// //connect to DB
// connectDB(dbUrl)
// // app .get('/',(req, res) =>{
// //     res.json({success: true, message:"OK"})
// // })

// app.listen (port,(req, res)=>{
// console.log(`fragrance hub server listening on port ${port}`);
// })


// app.use("/api/auth", authRouter)
// app.use("/api/category", categoryRouter)
// app.use("/api/product", productRouter);
// console.log("start")