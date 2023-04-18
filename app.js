const express = require('express')
const path = require("path");
const expressLayouts = require('express-ejs-layouts')
const FileUpload = require("express-fileupload");
const cors = require("cors");
const productRoute = require("./routes/productRoute");
const fs = require('fs');


const app = express()
const port = 3000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(FileUpload());
app.use(productRoute);


// gunakan ejs
app.set('view engine', 'ejs');

// Third-party middleware
app.use(expressLayouts)

// Built-in middleware
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "controller")))


// app.get('/', (req, res) => {
//     res.render('index', {
//         layout: 'layouts/main-layout',
//         title: 'Halaman Home'})
// })

// app.get('/add', (req, res) => {
//     res.render('add', {
//         layout: 'layouts/main-layout',
//         title: 'Halaman Add',
//     })
// })

// app.get('/update', (req, res) => {
//     res.render('update', {
//         layout: 'layouts/main-layout',
//         title: 'Halaman Update'})
// })

// app.use('/', (req, res) => {
//     res.status(404)
//     res.send('<h1>404</h1>')
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})