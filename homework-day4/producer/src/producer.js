const amqplib = require('amqplib')
const cron = require('node-cron')
const queueName = 'heartbeat'
const ws = require('ws')

const sendWsRequest = (msg) => {
  const socketConnection = new ws('ws://localhost:3000/heartbeat')
  socketConnection.onopen = () => {
    socketConnection.send(msg)
  }
}

const dateTimeJob = async () => {
  const client = await amqplib.connect('amqp://localhost:5672')
  const channel = await client.createChannel()
  await channel.assertQueue(queueName)
  const date = new Date()
  const wsMessage = `ws endpoint - I'm alive at ${date} \n`
  const amqpMessage = `amqp consumer - I'm alive at ${date} \n`

  sendWsRequest(wsMessage)

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(amqpMessage)), {
    contentType: 'application/json',
  })
}

const meaningOfLifeJob = async () => {
  const client = await amqplib.connect('amqp://localhost:5672')
  const channel = await client.createChannel()
  await channel.assertQueue(queueName)
  const wsMessage = 'ws endpoint - 42 is the meaning of life! \n'
  const amqpMessage = 'amqp endpoint - 42 is the meaning of life! \n'

  sendWsRequest(wsMessage)

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(amqpMessage)), {
    contentType: 'application/json'
  })
}

cron.schedule('* * * * *', () => {
  console.log('executing date time job')
  dateTimeJob()
})

cron.schedule('*/42 * * * *', () => {
  console.log('executing meaning of life')
  meaningOfLifeJob()
})