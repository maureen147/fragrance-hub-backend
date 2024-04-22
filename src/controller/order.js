import Order from'../models/order.js'

export const orderStatus=async (req,res)=>{
    try {
        const{orderId}=req.params;
        const{status}=req.body

        const order= await Order.findByIdAndUpdate(orderId,{status},{new:true});
        if (!order){
            return res.status(404).json({success: false, message: "Order not found"})
        }
        res.json({success:true, message: `your Order status have been updated to "${status}"`})
    } catch (err) {
        console.log(err);
        return res.status(500).json({success:false,message:err.message});
    }
}
// create the following endpoints
// Get all orders
export const getAllOrder = async (req, res) => {
    try {
    // const totalOrder = await Order.countDocuments();  
    const orders = await Order.find()

      res.status(200).json({sucess: true, message: "Showing All order", AllOrders: orders })
  } catch (err) {
      console.log(err.messsage, err);
      res.status(500).json({ sucesss: false, message: 'Geting all  order successful'},err.message );
    }
  };
//getOrderById
export const getOrderById = async (req, res) => {
    try {
    const orderId = req.params;  
    const order = Order.findById(orderId);

    if(!order){
        return res.status(404).json({success: false, message: "Order not found"})
    }
      res.status(200).json({sucess: true, message: "Show order id", order })
  } catch (err) {
      console.log(err.messsage, err);
      res.status(500).json({ sucesss: true, message: 'orderid created successfully'} );
    }
  };
//deleteOrderById
export const deleteOrderById = async (req, res) => {
    try {
    const totalOrder = await Order.findByIdAndDelete(orderId);  
    const order = Order.param()
if(!order){
    return res.status(404).json({ sucesss: false, message:'order not found '})
}
  } catch (err) {
      res.status(500).json({ sucesss: true, message: ' deleting order successfully'});
    }
  };
//searchOrderDate
// Controller function to search orders by date or date range with pagination
export const searchOrdersByDate = async (req, res) => {
    const { startDate, endDate } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      let query = {};
  
      // Check if both startDate and endDate parameters are provided
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      } else if (startDate) {
        // If only startDate is provided, search orders created on or after startDate
        query.createdAt = { $gte: new Date(startDate) };
      } else if (endDate) {
        // If only endDate is provided, search orders created on or before endDate
        query.createdAt = { $lte: new Date(endDate) };
      }
  
      // Search orders based on the constructed query
      const orders = await Order.find(query).skip(skip).limit(limit);
      const totalOrders = await Order.countDocuments(query);
  
      res.json({
        currentPage: page,
        ordersFound: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        orders,
      });
    } catch (error) {
      console.error('Error searching orders by date:', error);
      res.status(500).json({ success: false, message: 'Failed to search orders', errorMsg: error.message });
    }
  };
  