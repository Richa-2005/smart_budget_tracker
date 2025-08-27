import express from 'express'
import dotenv from 'dotenv'
import {connectDB} from './config/db.js'
// import budgetRoutes from './routes/budget.routes.js'
// import userRoutes from './routes/user.routes.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    connectDB()
    console.log(`Server started listening at port 3000 : http://localhost:${PORT}/`)
})

app.use(express.json())

// app.use('/user',userRoutes)

// app.use('/budget',budgetRoutes)
app.get('/',()=>{
    console.log('hello')
})