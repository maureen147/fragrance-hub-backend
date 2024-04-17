import express from 'express';
import { register, login, forgotPassword, resetPassword } from '../controller/auth.js';
import { upload } from '../helpers/multer.js';
import { isLoggedIn } from '../middlewares/auth.js';
import { getAllUsers, getOneUser, updateUser, updateUserRole } from '../controller/user.js';

const router = express.Router();

// routes
router.post('/register', upload.single('image'), register)
router.post('/login', login)

// User routes
router.get("/users",getAllUsers)
router.get("/user/:userId",getOneUser)
router.put("/user/update", isLoggedIn, upload.single("image"), updateUser)
router.post("/user/role", isLoggedIn, updateUserRole)


// forgot password ande reset password
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)


export default router


// import express from 'express';
// import { register, login, forgotPassword, resetPassword } from '../controller/auth.js';
// import { upload } from '../helpers/multer.js';
// import{deleteUser,getOneUser,getAllUsers,updateUser,updateUserRole}from '../controller/user.js';
// import { isLoggedIn } from '../middlewares/auth.js';

// const router = express.Router();

// // routes
// router.post('/register', upload.single('image'), register)
// router.post('/login', login)
// router.get('/all',getAllUsers)
// router.get('/one/:userId',getOneUser)
// router.put('/update/:userId',updateUser)
// router.delete('/:userId',deleteUser)
// router.post("/user/role", isLoggedIn,  updateUserRole)



// //forget password and reset password
// router.post('/forgotpwd',forgotPassword)
// router.post('/resetpwd',resetPassword)






// export default router