
const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    title: {type: String},
    comment: {type: [String]}
})

const Book = mongoose.model('BookSchema', BookSchema)

exports.Book = Book