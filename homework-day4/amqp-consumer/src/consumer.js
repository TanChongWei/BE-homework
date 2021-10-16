const amqplib = require('amqplib')
const fs = require('fs')
const queueName = 'heartbeat'

;(async () => {
  const client = await amqplib.connect('amqp://localhost:5672')
  const channel = await client.createChannel()
  await channel.assertQueue(queueName)
  channel.consume(queueName, (msg) => {
    const data = JSON.parse(msg.content)
    fs.appendFile('amqp-log.txt', data, (err) => {
      if (err) {
        throw err
      } console.log('date time appended!')
    })
    channel.ack(msg)
  })
})().catch(e => console.log(e))

