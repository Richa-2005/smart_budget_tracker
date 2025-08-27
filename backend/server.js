import express from 'express'
import dotenv from 'dotenv'
import {connectDB} from './config/db.js'
import cors from 'cors';
import budgetRoutes from './routes/budget.routes.js'
import userRoutes from './routes/user.routes.js'
// import userRoutes from './routes/user.routes.js'

const app = express()

app.use(express.json())
app.use(cors());
dotenv.config()
const PORT = 3000

app.use('/user',userRoutes)

app.use('/budget',budgetRoutes)

app.get('/',()=>{
    console.log('hello')
})

app.listen(PORT, ()=>{
    connectDB()
    console.log(`Server started listening at port 3000 : http://localhost:${PORT}/`)
})