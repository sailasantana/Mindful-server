require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const { NODE_ENV } = require('./misc/config')
const LoginRouter = require('./routers/login-router')
const JournalRouter = require('./routers/journal-router')
const validateToken = require('./misc/validateToken')
const app = express()


app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())

app.get('/',  (req, res) => {
  res.send('Hello, world!')
})

app.get('/validate', validateToken, (req,res) => {
  return res.status(200).json({});
})


app.use('/api', LoginRouter)
app.use(validateToken)
app.use('/api', JournalRouter)




module.exports = app;

