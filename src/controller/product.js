import Product from "../models/product.js";
import Order from"../models/order.js"
import { cloudinary } from "../helpers/cloudinary.config.js";
import slugify from "slugify";
import { sendEmail } from "../helpers/email.js";


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    const imageFiles = req.files;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const slug = slugify(name);
    let uploadedImages = [];

    if(imageFiles && imageFiles.length > 0) {
      uploadedImages = await Promise.all(
        imageFiles.map(async (file) => {
          try {
            const imageResult = await cloudinary.uploader.upload(file.path);
            return {
              url: imageResult.secure_url,
              imagePublicId: imageResult.public_id,
            };
          } catch (err) {
            console.error("Error uploading image to Cloudinary:", err);
            return {
              error: "Failed to upload image",
            };
          }
        })
      );
    }

    const newProduct = new Product({
      name,
      slug,
      description,
      price,
      category,
      quantity,
      images: uploadedImages,
    });

    await newProduct.save();

    // send email
    const sub="New product notification"
    const message=`A new product ${newProduct.name}has been added to our list`
    sendEmail("bisiattah@yahoo.com",sub,message);


    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error creating product:", err.message);
    res.status(500).json({ success: false, message: "Failed to create product", error: err.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, category, quantity } = req.body;
    const imageFiles = req.files;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
   
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;

    if(name){
      const nameSlug = slugify(name)
      product.slug =  nameSlug || product.slug;

    }

    // Delete previously uploaded images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (image) => {
          try {
            await cloudinary.uploader.destroy(image.imagePublicId);
          } catch (err) {
            console.error("Error deleting image from Cloudinary:", err.message);
          }
        })
      );
    }

    // Upload new images to Cloudinary
    let uploadedImages = [];

    if (imageFiles && imageFiles.length > 0) {
      uploadedImages = await Promise.all(
        imageFiles.map(async (file) => {
          try {
            const imageResult = await cloudinary.uploader.upload(file.path);
            return {
              url: imageResult.secure_url,
              imagePublicId: imageResult.public_id,
            };
          } catch (err) {
            console.error("Error uploading image to Cloudinary:", err.message);
            return {
              error: "Failed to upload image",
            };
          }
        })
      );
    }

    product.images = uploadedImages.length > 0 ? uploadedImages : product.images;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ success: false, message: "Error updating product", error: err.message });
  }
};


// Get all products with pagination
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      productCount: totalProducts,
      products,
    });
  } catch (err) {
    console.error("Error fetching all products:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch products", error: err.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("Error fetching product by ID:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch product", error: err.message });
  }
};

// Get product by slug
export const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("Error fetching product by slug:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch product", error: err.message });
  }
};

// Delete product by ID
export const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: `Product ID: ${productId} deleted successfully` });
  } catch (err) {
    console.error("Error deleting product by ID:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete product", error: err.message });
  }
};

// Search products with pagination
export const searchProduct = async (req, res) => {
  const { term } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const searchRegex = new RegExp(term, 'i');

    const products = await Product.find({
      $and: [
        { isAvailable: true },
        {
          $or: [
            { name: searchRegex },
            { description: searchRegex },
          ],
        },
      ],
    }).skip(skip).limit(limit);

    const totalProducts = await Product.countDocuments({
      $and: [
        { isAvailable: true },
        {
          $or: [
            { name: searchRegex },
            { description: searchRegex },
          ],
        },
      ],
    });

    res.json({
      currentPage: page,
      productsFound: totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products,
      
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, message: 'Failed to search products', errorMsg: error.message });
  }
};

export const relatedProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Find related products based on the category or brand of the provided product
    const relatedProducts = await Product.find({
      $or: [
        { category: product.category }, // Find by category
        { brand: product.brand },       // Find by brand
      ],
      _id: { $ne: productId } // Exclude the provided product itself from the related products
    }).limit(5).populate("category"); // Limit

    res.status(200).json({ success: true, relatedProducts });
  } catch (err) {
    console.error("Error fetching related products:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch related products", error: err.message });
  }
};
 

//  processPayment
export const processPayment = async (req, res) => {
  try {
    // payment reference and cart items
    const { paymentRef, cartItems } = req.body;

    // validations
    if (paymentRef === null || paymentRef === undefined) {
      return res.json({ success: false, message: "Payment ref is required" });
    }
    if (!cartItems.length > 0) {
      return res.json({ success: false, message: "No cart or cart is empty" });
    }

    let total = 0;
    const orderedProducts = [];

    // Fetch each product from the DB and calculate the total
    for (let i = 0; i < cartItems.length; i++) {
      const product = await Product.findById(cartItems[i]);
      if (!product) {
        return res.json({ success: false, message:` Product with ID ${cartItems[i]} not found` });
      }
      total += product.price;
      orderedProducts.push(product._id);
    }

    console.log(total);

    // initialize payment gateway
    let newTransaction = {
      amount: total,
      paymentStatus: paymentRef,
    };

    // If payment is successful, create new order
    if (newTransaction.paymentStatus === true) {
      // create new order
      const order = new Order({
        products: orderedProducts, 
        payment: newTransaction,
        buyer: req.user._id,
        totalAmount: newTransaction.amount
      });

      await order.save();

      console.log("Payment Successful, order created");
      return res.json({ success: true, message: "Payment successful, order created", order });
    } else {
      console.log("Payment Failed, no order created");
      return res.json({ success: false, message: "Payment failed, order not created" });
    }

  } catch (err) {
    console.error("Payment failed, order not created", err.message);
    res.status(500).json({ success: false, message: "Payment failed, order not created", error: err.message });
  }
};

//import Product from "../models/product.js";
// import { cloudinary } from "../helpers/cloudinary.config.js";
// import slugify from "slugify";

// export const getAllProducts = async(req, res)=>{
//     try {
//       const product = await Product.find();
//       res.json({ success: true, message: "Products Retrieved Successfully", product });
      
//     } catch (err) {
//       console.log("Error creating product", err.message);
//       res.status(500).json({success: false, error: "Internal server error", message: err.message})
      
//     }
//   }
//   export const getProductById = (req, res) =>{
//     try {
//       const { productId } = req.params;
//       Product.findById(productId)
//        .then((product) => {
//           res.status(200).json({
//             success: true,
//             message: "Product fetched successfully",
//             product,
//           });
//         })
//        .catch((err) => {
//           res.status(500).json({
//             success: false,
//             message: "Failed to fetch product",
//             error: err,
//           });
//         });
//     } catch (err) {
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch product",
//         error: err,
//       });
//     }
//   }

// export const createProduct = async (req, res) => {
//   try {
//     const { name, description, price, category, quantity } = req.body;
//     const imageFiles = req.files;

//     if (!name || !description || !price || !category || !quantity) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const slug = slugify(name);
//     let uploadedImages = [];

//     if(imageFiles && imageFiles.length > 0) {
//       uploadedImages = await Promise.all(
//         imageFiles.map(async (file) => {
//           try {
//             const imageResult = await cloudinary.uploader.upload(file.path);
//             return {
//               url: imageResult.secure_url,
//               imagePublicId: imageResult.public_id,
//             };
//           } catch (err) {
//             console.error("Error uploading image to Cloudinary:", err);
//             return {
//               error: "Failed to upload image",
//             };
//           }
//         })
//       );
//     }

//     const newProduct = new Product({
//       name,
//       slug,
//       description,
//       price,
//       category,
//       quantity,
//       images: uploadedImages,
//     });

//     await newProduct.save();

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       product: newProduct,
//     });
//   } catch (err) {
//     console.error("Error creating product:", err.message);
//     res.status(500).json({ success: false, message: "Failed to create product", error: err.message });
//   }
// };


// export const updateProduct = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { name, description, price, category, quantity } = req.body;
//     const imageFiles = req.files;

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }
   
//     product.name = name || product.name;
//     product.description = description || product.description;
//     product.price = price || product.price;
//     product.category = category || product.category;
//     product.quantity = quantity || product.quantity;

//     if(name){
//       const nameSlug = slugify(name)
//       product.slug =  nameSlug || product.slug;

//     }

//     // Delete previously uploaded images from Cloudinary
//     if (product.images && product.images.length > 0) {
//       await Promise.all(
//         product.images.map(async (image) => {
//           try {
//             // Delete image from Cloudinary
//             await cloudinary.uploader.destroy(image.imagePublicId);
//           } catch (err) {
//             console.error("Error deleting image from Cloudinary:", err);
//           }
//         })
//       );
//     }

//     // Upload new images to Cloudinary
//     let uploadedImages = [];

//     if (imageFiles && imageFiles.length > 0) {
//       uploadedImages = await Promise.all(
//         imageFiles.map(async (file) => {
//           try {
//             const imageResult = await cloudinary.uploader.upload(file.path);
//             return {
//               url: imageResult.secure_url,
//               imagePublicId: imageResult.public_id,
//             };
//           } catch (err) {
//             console.error("Error uploading image to Cloudinary:", err);
//             return {
//               error: "Failed to upload image",
//             };
//           }
//         })
//       );
//     }

//     product.images = uploadedImages.length > 0 ? uploadedImages : product.images;


//     // Save updated product
//     await product.save();

//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       product: product,
//     });
//   } catch (err) {
//     console.error("Error updating product:", err.message);
//     res.status(500).json({ success: false, message: "Error updating product", error: err.message });
//   }
// };