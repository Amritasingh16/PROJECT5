const express = require('express')
const router = express.Router()
const {registerUser,loginUser,getUserByParams,updateUser} = require("../controllers/userController")
const {createProduct,getProductsByQuery,getProductsByParams,updateProductsByParams,deleteProductsByParams} = require("../controllers/productController")
const {createCartByParams,updateCartByParams,getCartByParams,deleteCartByParams} = require("../controllers/cartController")
const {authentication} = require("../middlewares/auth")

//----------------USER------------------------------
router.post("/register",registerUser) //Bhavi bro
router.post("/login",loginUser) //paras bhai
router.get("/user/:userId/profile",authentication,getUserByParams) //sourav
router.put("/user/:userId/profile",authentication,updateUser) //bhusan bhai 

//-----------------PRODUCTS--------------------------
router.post("/products",createProduct) //amrita brocode
router.get("/products",getProductsByQuery) //bhavi bhai
router.get("/products/:productId",getProductsByParams) //sourav 
router.put("/products/:productId",updateProductsByParams) //bhusan bhai-----bhavi bhai
router.delete("/products/:productId",deleteProductsByParams) //amrita 


//--------------------CART-----------------------------
router.post("/users/:userId/cart",authentication,createCartByParams) //amrita brocode
router.put("/users/:userId/cart",authentication,updateCartByParams) //bhavi bhaii---bhusan bhai
router.get("/users/:userId/cart",authentication,getCartByParams) //paras bhai
router.delete("/users/:userId/cart",authentication,deleteCartByParams) // sourav






router.all("/*", function (req, res) {
    return res
      .status(400)
      .send({ status: false, message: "invalid http request" });
  });
  

module.exports = router