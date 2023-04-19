const express = require('express');
const router = express.Router();
const {Cars} = require('../models');
const sequelize = require('sequelize');

router.get('/', async function(req, res, next) {
    const cars = await Cars.findAll({order: [['name', 'ASC']]});
    res.render('pages/index', { cars: cars, filter: "all", save:""});
});

router.get('/saved', async function(req, res, next) {
    const cars = await Cars.findAll({order: [['name', 'ASC']]});
    res.render('pages/index', { cars: cars, filter: "all", save:"success"});
});

router.post('/find', async function(req, res, next) {
    console.log(req.body);
    const search = req.body.name.toLowerCase();
    const cars = await Cars.findAll({order: [['name', 'ASC']], where: {name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + search + '%')}});
    // res.render('pages/index', { cars: cars, filter: "all", save:""});
    res.render('pages/index', { cars: cars, filter: "all", save:""});
});

// filter

// small
router.get('/small', async function(req, res, next) {
    const cars = await Cars.findAll({order: [['name', 'ASC']], where: {size: 'Small'}});
    res.render('pages/index', { cars: cars, filter: "small",  save:""});
});

// medium
router.get('/medium', async function(req, res, next) {
    const cars = await Cars.findAll({order: [['name', 'ASC']], where: {size: 'Medium'}});
    res.render('pages/index', { cars: cars, filter: "medium",  save:""});
});

// large
router.get('/large', async function(req, res, next) {
    const cars = await Cars.findAll({order: [['name', 'ASC']], where: {size: 'Large'}});
    res.render('pages/index', { cars: cars, filter: "large",  save:""});
});

// add
router.get('/add', function(req, res, next) {
    res.render('pages/add-page', { title: 'Express' });
});

// update
router.get('/update/:id', async function(req, res, next) {
    const car = await Cars.findByPk(req.params.id);
    // console.log(car)
    if(!car){
        return res.status(404).json({msg: "No Data Found"});
    }
    res.render('pages/update-page', { Cars: car });
});

module.exports = router;