import express from 'express';
import { createProduct, deleteProductById, getAllProducts, getBySlug, getProductById, processPayment, relatedProduct, searchProduct, updateProduct} from '../controller/product.js';
import { upload } from '../helpers/multer.js';
import { isLoggedIn } from '../middlewares/auth.js';
import { orderStatus } from '../controller/order.js';

const router = express.Router();

router.post('/create', upload.array('images', 5), createProduct);
router.put("/update/:productId", upload.array('images', 5), updateProduct)

router.get("/all", getAllProducts)
router.put('/:productId', updateProduct)
router.post('/create', createProduct)
router.get("/:productId", getProductById)
router.get("/slug/:slug", getBySlug)
router.delete("/:productId", deleteProductById)
router.post("/search", searchProduct)
router.get("/related/:productId", relatedProduct)

//payment
router.post("/payment",isLoggedIn, processPayment)

//orders


export default router;


// import express from 'express';
// import { createProduct, getAllProducts, getProductById, updateProduct} from '../controller/product.js';
// import { upload } from '../helpers/multer.js';


// const router = express.Router();

// router.post('/create', upload.array('images', 5), createProduct);
// router.get('/all',getAllProducts);
// router.get('/:productId',getProductById);
// router.put("/update/:productId", upload.array('images', 5), updateProduct)



// export default router;

// import express from 'express';
// import { createProduct, deleteProduct, getAllProducts, getOneProduct, getProductBySlug, updateProduct } from '../controller/product.js'

// const router = express.Router();

// router.post('/create', createProduct)
// router.get('/all', getAllProducts)
// router.get('/:productId', getOneProduct)
// router.put('/:productId', updateProduct)
// router.get('/slug/:slug', getProductBySlug)
// router.delete('/:productId', deleteProduct)

// export default router;