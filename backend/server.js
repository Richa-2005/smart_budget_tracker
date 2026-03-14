import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

import budgetRoutes from './routes/budget.routes.js';
import userRoutes from './routes/user.routes.js';
import budgetGoalRoutes from './routes/budgetGoal.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/budget', budgetRoutes);
app.use('/user', userRoutes);
app.use('/budget-goal', budgetGoalRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the root route!');
});

const PORT = process.env.PORT || 5500;

connectDB();

app.listen(PORT, () => {
  console.log(`Server started listening at port ${PORT} : http://localhost:${PORT}/`);
});