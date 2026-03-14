import mongoose from 'mongoose';

const budgetGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    weeklyBudget: {
      type: Number,
      default: 0,
      min: 0,
    },
    monthlyBudget: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const BudgetGoal = mongoose.model('BudgetGoal', budgetGoalSchema);

export default BudgetGoal;
