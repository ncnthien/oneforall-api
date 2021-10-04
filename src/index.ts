import express, { Application } from 'express'
import config from './config'
import connect from './database/connect'
import routes from './routes'

const app: Application = express()

// for parsing application/json and parsing application/x-www-form-urlencoded
app.use(express.json({ limit: '50mb' }))
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
)
// for save static files in public folder
app.use(express.static('public'))

app.listen(config.port, () => {
  console.log(`Oneforall has been ready to hear you on port ${config.port}`)
  connect()
  routes(app)
})
