const router = require('express').Router();

const productController = require('../controller/dataController');

// API

router.get('/products', productController.getProducts)

router.get('/products/:id', productController.getProductById)

router.post('/products', productController.createProduct)

router.get('/products/search', productController.searchProduct)

router.put('/products/:id', productController.editProduct)

router.delete('/products/:id', productController.deleteProduct)



// Dashboard
module.exports = router