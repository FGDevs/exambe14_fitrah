const express       = require('express') // to use call express library
const app           = express(); 
const cors          = require('cors'); // to read GET,HEAD,POST,PUT,DELETE request Handler
const bearerToken   = require('express-bearer-token'); // to bring token as request query

require('dotenv').config() // to read & pass .env 

app.use(cors())
app.use(bearerToken())
app.use(express.json()) // to parse json type of request
app.use(express.urlencoded({ extended:false })) // to parse request body
app.use(express.static('public'))

const PORT = process.env.PORT || 8000

app.get('/',(req,res)=>{
    res.send('WELCOME IN UJIAN MARKET API!')
})

const {
    AuthRouter
} = require('./routes')

app.use('/user',AuthRouter)

app.listen(PORT,()=>{
    console.log(`API aktif di PORT ${PORT}`)
})