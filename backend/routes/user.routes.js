import express from 'express'

const router = express.Router()

router.get('/',getProducts)

router.post('/',postProducts)

router.put('/:id',putProducts)

router.delete('/:id',deleteProducts)
