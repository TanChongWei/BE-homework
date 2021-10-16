const app = require('express')()
const enableWs = require('express-ws')
const fs = require('fs')

enableWs(app)

app.ws('/heartbeat', (ws, req) => {
  ws.on('message', (msg) => {
    fs.appendFile('ws-log.txt', msg, (err) => {
      if (err) {
        throw err
      } console.log('web socket - date time appended!')
    })
  })
})

app.get('/', (req, res) => {
  res.send('server started!')
})

app.listen(3000, () => {
  console.log('listening on PORT : 3000')
})