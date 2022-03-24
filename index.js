const express = require('express')
const designsRoutes = require('./api/handlers/designs')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

let envPort
const { ENV } = process.env

if (ENV === 'dev') {
  envPort = 3333
}

const app = express()
const port = process.env.PORT || envPort

app.use(express.json())

app.use(cors())

app.get('/', (req, res) => {
  res.send('Api root')
})

designsRoutes(app)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started at http://localhost:${port}`)
})

module.exports = app