import express from 'express'

const router = express.Router()


router.get('/:userId/:date',getBudget)

router.post('/:userId/:date/post',postBudget)

router.put('/:userId/:date/post',putBudget)

router.delete('/:userId/:date/delete',deleteProducts)

