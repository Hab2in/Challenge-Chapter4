const express = require('express')
const expressLayouts = require('express-ejs-layouts')


const app = express()
const port = 3000

// gunakan ejs
app.set('view engine', 'ejs');

// Third-party middleware
app.use(expressLayouts)

// Built-in middleware
app.use(express.static('public'));



app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout',
        title: 'Halaman Home'})
})

app.get('/add', (req, res) => {
    res.render('add', {
        layout: 'layouts/main-layout',
        title: 'Halaman Add',
    })
})

app.get('/update', (req, res) => {
    res.render('update', {
        layout: 'layouts/main-layout',
        title: 'Halaman Update'})
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404</h1>')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})