const express = require('express')
const router = express.Router()
const {registerUser,loginUser,getUserByParams,updateUser} = require("../controllers/userController")
const {createProduct,getProductsByQuery,getProductsByParams,updateProductsByParams,deleteProductsByParams} = require("../controllers/productController")
const {createCartByParams,updateCartByParams,getCartByParams,deleteCartByParams} = require("../controllers/cartController")
const {authentication} = require("../middlewares/auth")

//----------------USER------------------------------
router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authentication,getUserByParams)
router.put("/user/:userId/profile",authentication,updateUser)

//-----------------PRODUCTS--------------------------
router.post("/products",createProduct)
router.get("/products",getProductsByQuery)
router.get("/products/:productId",getProductsByParams)
router.put("/products/:productId",updateProductsByParams)
router.delete("/products/:productId",deleteProductsByParams)


//--------------------CART-----------------------------
router.post("/users/:userId/cart",authentication,createCartByParams)
router.put("/users/:userId/cart",authentication,updateCartByParams)
router.get("/users/:userId/cart",authentication,getCartByParams)
router.delete("/users/:userId/cart",authentication,deleteCartByParams)






router.all("/*", function (req, res) {
    return res
      .status(400)
      .send({ status: false, message: "invalid http request" });
  });
  

module.exports = router