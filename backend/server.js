require('dotenv').config()


const express = require('express')
//to require express package
const mongoose = require('mongoose')
const queryRoute = require('./routes/queries')
const userRoutes = require('./routes/user')

//express app
const app = express()

//middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes: first this at first
//when the user is on this route then the api should shoot these routes
app.use('/api/queries', queryRoute)
app.use('/api/user', userRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connect to db and listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })


