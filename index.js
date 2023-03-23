const express = require('express')
require('dotenv').config()


const routers = require('./src/routers/index')



const app = express()

const cors = require("cors");
const corsOptions = {
   origin: '*',
   credentials: true,
   optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

//middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//views
app.set('view engine', 'ejs')
app.set('views', './src/views')

// static
app.use(express.static(__dirname + '/src/public'))
// app.use('./css', express.static(__dirname + 'css'))
// app.use('./img', express.static(__dirname + 'public/img'))

routers(app)

app.listen(process.env.PORT || 3200, ()=> {
   console.log('run______');
})