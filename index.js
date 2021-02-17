const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const cors = require('cors')
app.use(cors())

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/books', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', function(err) {
    console.log(err)
})
db.on('open', function() {
    console.log('Connection Established ...')
    app.listen(3000, function() {
        console.log('Server is Running ...')
    })
})
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    cover: String
})
const Book = mongoose.model('Book', bookSchema)

app.get('/books', function(req, res) {
    Book.find(function(err, books) {
        res.send(books)
    })
})

app.get('/:id', function(req, res) {
    const id = req.params.id
    Book.findById(id, function(err, book) {
        res.send(book)
    })
})

app.post('/save', function(req, res) {
    const newTitle = req.body.title
    const newAuthor = req.body.author
    const newCover = req.body.cover
    const book = new Book({title: newTitle, author: newAuthor, cover: newCover})
    book.save(function(err, book) {
        res.status(200)
    })
})

app.post('/update', function(req, res) {
    const id = req.body.id
    const title = req.body.title
    const author = req.body.author
    const cover = req.body.cover
    Book.findById(id, function(err, book) {
        book.title = title
        book.author = author
        book.cover = cover
        book.save(function(err, book) {
            res.status(200)
        })
    })
})

app.get('/remove', function(req, res) {
    const id = req.query.id
    Book.deleteOne({_id: id}, function(err) {
        res.status(200)
    })
})