const express = require('express')
const router = express.Router()
const {registerUser,loginUser,getUserByParams,updateUser} = require("../controllers/userController")
const {createProduct,getProductsByQuery,getProductsByParams,updateProductsByParams,deleteProductsByParams} = require("../controllers/productController")
const {createCartByParams,updateCartByParams,getCartByParams,deleteCartByParams} = require("../controllers/cartController")
const {createOrder,updateOrder}= require("../controllers/orderController")
const {authentication} = require("../middlewares/auth")

//----------------USER------------------------------
router.post("/register",registerUser) //Bhavi 
router.post("/login",loginUser) //paras 
router.get("/user/:userId/profile",authentication,getUserByParams) //sourav
router.put("/user/:userId/profile",authentication,updateUser) //bhusan 

//-----------------PRODUCTS--------------------------
router.post("/products",createProduct) //amrita 
router.get("/products",getProductsByQuery) //bhavi 
router.get("/products/:productId",getProductsByParams) //sourav 
router.put("/products/:productId",updateProductsByParams) //bhusan -----bhavi 
router.delete("/products/:productId",deleteProductsByParams) //amrita 


//--------------------CART-----------------------------
router.post("/users/:userId/cart",authentication,createCartByParams) //amrita 
router.put("/users/:userId/cart",authentication,updateCartByParams) //bhavi ---bhusan 
router.get("/users/:userId/cart",authentication,getCartByParams) //paras 
router.delete("/users/:userId/cart",authentication,deleteCartByParams) // sourav

//---------------------------Order-------------------------------
router.post("/users/:userId/orders",authentication,createOrder) 
router.put("/users/:userId/orders",authentication,updateOrder)





router.all("/*", function (req, res) {
    return res
      .status(400)
      .send({ status: false, message: "invalid http request" });
  });
  

module.exports = router