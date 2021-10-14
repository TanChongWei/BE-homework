const express = require('express')
const Item = require('../models/item')

module.exports = (db) => {
  const router = express.Router()

  router.post('/', async (req, res, next) => {
    const uid = req.uid
    const { name, quantity } = req.body
    const newItem = new Item({ name, quantity, uid })
    const item = await db.insertItem(newItem)
    res.status(201).send(item)
  })

  router.get('/', async (req, res, next) => {
    const uid = req.uid
    const items = await db.findAllItems(uid)
    res.send(items)
  })

  router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    const item = await db.findItem(id)
    if (item) {
      res.send(item)
    } else {
      res.status(400).send(`Item id ${id} not found`)
    }
  })

  router.get('/:userId', async (req, res, next) => {
    const uid = req.uid
    if (uid) {
      const items = await db.findAllItemsByUid(uid)
      return items ? res.send(items) : res.send('No items found')
    } 
    res.status(400).send('No uid found')
  })

  router.put('/:id', async (req, res, next) => {
    const uid = req.uid
    const id = req.params.id
    const { name, quantity } = req.body
    const updatedItem = new Item({ name, quantity, uid })
    const item = await db.updateItem(id, updatedItem)
    return item 
      ? res.send(item)
      : res.status(400).send('unauthorised!')
     
  })

  router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    const success = await db.deleteItem(id)
    if (success) {
      res.send(`Deleted item ${id} successfully`)
    } else {
      res.status(400).send(`Item id ${id} not found`)
    }
  })

  return router
}