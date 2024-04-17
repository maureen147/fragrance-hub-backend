import jwt from  "jsonwebtoken";
import User from '../models/user.js';

export const isLoggedIn= async (req,res,next)=>{
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer") ){
    return res.status(401).json({success:false,message:'Invalid Token or No token provided'})
  }
  //extract the token 
  const token = authHeader.split(" ")[1];
  //verify the token 
  if(token){
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
      if(err){
        res.status(403).json({success: false, message:"Invalid token"})
      }else{
          req.user = decoded
          console.log({decoded});
          next()
      }
    })
    
     


}else{
    res.status(401).json({success: false, message: 'Invalid token or no token provided'})
}


}

export const isAdmin=async(req,res,next)=>{
 try {
    const userId= req.user._id;
    const user= await User.findById(userId);
    console.log(user.role);
    if(!user){
        return res.status(404).json({success:false,message:"user not found"});
    }
   //check  user roles
   if(user.role === 1){
    next()
    // return res.status(403).json({sucess:false, message: 'You are not authorized'})
}else{
   return res.status(403).json({sucess:false, message: 'You are not authorized'})

}    
    
 } catch (err) {
    console.log(err);
    res.json({success: false, message:"Error checking adminn"})
    
 }
}
