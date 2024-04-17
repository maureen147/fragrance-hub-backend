import express from 'express';
import { deleteOrderById, getAllOrder, getOrderById, orderStatus, searchOrdersByDate } from "../controller/order.js"

const router = express.Router();

router.get("/orders",getAllOrder)
router.get("/order/:orderId",getOrderById)
router.delete("/:orderId", deleteOrderById)
router.post("/search/term",searchOrdersByDate )
router.put("/status/:orderId", orderStatus)


export default router;


