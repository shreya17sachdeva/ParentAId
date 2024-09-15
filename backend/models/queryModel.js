//type of schema/data we are going to use in the model is called the schema

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const querySchema = new Schema({
    question: {
        type: String, 
        required: true
    },

    answer: {
        type: String,
        required: true
    },

    user_id: {
        type: String,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model('Query',querySchema)

//Query.find()