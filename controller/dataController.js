const { data } = require('../models');
const path = require('path');
const Validator = require('fastest-validator');
const v = new Validator();
const fs = require('fs');

async function getProducts(req, res) {
    try {
        const response = await data.findAll()
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

async function getProductById(req, res) {
    try {
        const response = await data.findOne({
            where: {
                id : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

async function createProduct(req, res) {
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.name;
    const rent = parseInt(req.body.rent);
    const size = req.body.size;
    const file = req.files.img;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
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

    if(!allowedType.includes(ext.toLocaleLowerCase())) 
    return res.status(422).json({msg : "Invalid Images"});
    if(fileSize > 5000000) 
    return res.status(422).json({mgs : "Image must be less than 5MB"})

    if(valid){
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 2000000) return res.status(422).json({msg: "Image must be less than 2 MB"});

        file.mv(`./public/images/${fileName}`, async(err)=>{
            if(err) return res.status(500).json({msg: err.message});
            try {
                await data.create({name: name, rent: rent, size: size, img: url});
                res.status(201).json({msg: "Cars Created Successfuly"});
            } catch (error) {
                console.log(error.message);
            }
        })
    }
    else{
        res.status(400).json({error: valid});
    }
    
}


async function searchProduct(req, res) {

}

async function editProduct(req, res) {
    const car = await data.findByPk(req.params.id);
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
        fileName = file.md5 + ext;
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
                    await data.update({name: name, rent: rent, size: size, img: url}, {where: {id: req.params.id}});
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
                await data.update({name: name, rent: rent, size: size, img: url}, {where: {id: req.params.id}});
                res.status(201).json({msg: "Cars Updated Successfuly"});
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    else{
        res.status(400).json({error: valid});
    }
}

async function deleteProduct(req, res) {
    const car = await data.findOne({
        where : {
            id : req.params.id
        }
    });
    if(!car) return res.status(404).json({msg : "No Data Found"});

    try {
        const fileName = car.img.split("/").pop();
        const filepath = `./public/images/${fileName}`;
        fs.unlinkSync(filepath);
        await data.destroy({
            where: {
                id : req.params.id
            }
        });
        res.status(200).json({smg : "Success Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    searchProduct,
    editProduct,
    deleteProduct,

}