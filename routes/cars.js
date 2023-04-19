const router = require('express').Router();
const {Cars} = require('../models');
const Validator = require('fastest-validator');
const v = new Validator();
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// semua
router.get('/', async (req, res) => {
    const cars = await Cars.findAll({order: [['name', 'ASC']]});
    res.json(cars);
});

// by id
router.get('/:id', async (req, res) => {
    if(req.params.id){
        const id = parseInt(req.params.id);
        const car = await Cars.findByPk(id);
        res.json(car);
    }
});

// semua
router.post('/', async (req, res) => {
    if(!req.files) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.name;
    const rent = parseInt(req.body.rent);
    const size = req.body.size;
    const file = req.files.img;
    const fileSize = file.size
    const ext = path.extname(file.name);
    const fileName = file.md5 + makeRandom(5)+ ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];

    const schema = {
        name: {type: "string", min: 3, max: 50},
        rent: {type: "number", positive: true, integer: true, min: 1886, max: 2022},
        size: {type: "string", min: 3, max: 50},
        img: {type: "string", min: 3, max: 255}
    };
    const validate = v.compile(schema);
    const valid = validate({name: name, rent: rent, size: size, img: url});

    if(valid){
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 2000000) return res.status(422).json({msg: "Image must be less than 2 MB"});

        file.mv(`./public/images/${fileName}`, async(err)=>{
            if(err) return res.status(500).json({msg: err.message});
            try {
                await Cars.create({name: name, rent: rent, size: size, img: url});
                res.status(201).json({msg: "Cars Created Successfuly"});
            } catch (error) {
                console.log(error.message);
            }
        })
    }
    else{
        res.status(400).json({error: valid});
    }
    
});

// by view
router.post('/postCar', async (req, res) => {
    if(!req.files) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.name;
    const rent = parseInt(req.body.rent);
    const size = req.body.size;
    const file = req.files.img;
    const fileSize = file.size
    const ext = path.extname(file.name);
    const fileName = file.md5 + makeRandom(5)+ ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];

    const schema = {
        name: {type: "string", min: 3, max: 50},
        rent: {type: "number", positive: true, integer: true, min: 1886, max: 2022},
        size: {type: "string", min: 3, max: 50},
        img: {type: "string", min: 3, max: 255}
    };
    const validate = v.compile(schema);
    const valid = validate({name: name, rent: rent, size: size, img: url});

    if(valid){
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 2000000) return res.status(422).json({msg: "Image must be less than 2 MB"});

        file.mv(`./public/images/${fileName}`, async(err)=>{
            if(err) return res.status(500).json({msg: err.message});
            try {
                await Cars.create({name: name, rent: rent, size: size, img: url});
                res.redirect('/saved')
            } catch (error) {
                console.log(error.message);
            }
        })
    }
    else{
        res.status(400).json({error: valid});
    }
    
});

// semua
router.put('/:id', async (req, res) => {
    const car = await Cars.findByPk(req.params.id);
    if(!car){
        return res.status(404).json({msg: "No Data Found"});
    }

    let url;
    let name;
    let rent;
    let size;
    let fileName;
    let ext = '';
    let fileSize;
    let file;
    let allowedType = ['.png','.jpg','.jpeg'];

    if(req.files){
        file = req.files.img;
        fileSize = file.size
        ext = path.extname(file.name);
        fileName = file.md5 + makeRandom(5)+ ext;
        url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    }
    else{
        url = car.img;
    }

    (req.body.name) ? name = req.body.name : name = car.name;
    (req.body.rent) ? rent = parseInt(req.body.rent) : rent = car.rent;
    (req.body.size) ? size = req.body.size : size = car.size;
        
    const schema = {
        name: {type: "string", min: 3, max: 50},
        year: {type: "number", positive: true, integer: true, min: 1886, max: 2022},
        size: {type: "string", min: 3, max: 50},
        img: {type: "string", min: 3, max: 255}
    };
    const validate = v.compile(schema);
    const valid = validate({name: name, rent: rent, size: size, img: url});

    if(valid){
        if(req.files){
            if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
            if(fileSize > 2000000) return res.status(422).json({msg: "Image must be less than 2 MB"});

            file.mv(`./public/images/${fileName}`, async(err)=>{
                if(err) return res.status(500).json({msg: err.message});
                try {
                    await Cars.update({name: name, rent: rent, size: size, img: url}, {where: {id: req.params.id}});
                    res.status(201).json({msg: "Cars Updated Successfuly"});
                    //delete img before
                    const nameBefore = car.img.split("/").pop();
                    const filepath = `./public/images/${nameBefore}`;
                    fs.unlinkSync(filepath);
                } catch (error) {
                    console.log(error.message);
                }
            })
        }
        else{
            try {
                await Cars.update({name: name, rent: rent, size: size, img: url}, {where: {id: req.params.id}});
                res.status(201).json({msg: "Cars Updated Successfuly"});
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    else{
        res.status(400).json({error: valid});
    }
});

// by view
router.post('/updateCar/:id', async (req, res) => {
    const car = await Cars.findByPk(req.params.id);
    if(!car){
        return res.status(404).json({msg: "No Data Found"});
    }

    let url;
    let name;
    let rent;
    let size;
    let fileName;
    let ext = '';
    let fileSize;
    let file;
    let allowedType = ['.png','.jpg','.jpeg'];

    if(req.files){
        file = req.files.img;
        fileSize = file.size
        ext = path.extname(file.name);
        fileName = file.md5 + makeRandom(5) + ext;
        url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        // console.log(url)
    }
    else{
        url = car.img;       
    }

    (req.body.name) ? name = req.body.name : name = car.name;
    (req.body.rent) ? rent = parseInt(req.body.rent) : rent = car.rent;
    (req.body.size) ? size = req.body.size : size = car.size;
        
    const schema = {
        name: {type: "string", min: 3, max: 50},
        year: {type: "number", positive: true, integer: true, min: 1886, max: 2022},
        size: {type: "string", min: 3, max: 50},
        img: {type: "string", min: 3, max: 255}
    };
    const validate = v.compile(schema);
    const valid = validate({name: name, rent: rent, size: size, img: url});

    if(valid){
        if(req.files){
            if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
            if(fileSize > 2000000) return res.status(422).json({msg: "Image must be less than 2 MB"});

            file.mv(`./public/images/${fileName}`, async(err)=>{
                if(err) return res.status(500).json({msg: err.message});
                try {
                    await Cars.update({name: name, rent: rent, size: size, img: url}, {where: {id: req.params.id}});
                    console.log(url, `./public/images/${fileName}`)
                    //delete img before
                    const nameBefore = car.img.split("/").pop();
                    const filepath = `./public/images/${nameBefore}`;
                    fs.unlinkSync(filepath);       
                    res.redirect('/saved');           
                } catch (error) {
                    console.log(error.message);
                }
            })
        }
        else{
            try {
                await Cars.update({name: name, rent: rent, size: size, img: url}, {where: {id: req.params.id}});
                res.redirect('/saved');
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    else{
        res.status(400).json({error: valid});
    }
});

// hapus
router.delete('/:id', async (req, res) => {
    const car = await Cars.findByPk(req.params.id);
    const fileName = car.img.split("/").pop();
    const filepath = `./public/images/${fileName}`;
    // fs.unlinkSync(filepath);
    const msg = await Cars.destroy({where: {id: req.params.id}});
    res.json(msg);
});

//by View
router.get('/deleteCar/:id', async (req, res) => {
    const car = await Cars.findByPk(req.params.id);
    const fileName = car.img.split("/").pop();
    const filepath = `./public/images/${fileName}`;
    fs.unlinkSync(filepath);
    const msg = await Cars.destroy({where: {id: req.params.id}});
    res.redirect("/");
});

function makeRandom(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
    }
    return result;
}


module.exports = router;