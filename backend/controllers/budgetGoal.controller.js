import BudgetGoal from '../model/budgetGoal.model.js';

export const saveBudgetGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { weeklyBudget, monthlyBudget } = req.body;

    const updatedGoal = await BudgetGoal.findOneAndUpdate(
      { userId },
      {
        userId,
        weeklyBudget: weeklyBudget ?? 0,
        monthlyBudget: monthlyBudget ?? 0,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Budget goals saved successfully',
      data: updatedGoal,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getBudgetGoal = async (req, res) => {
  try {
    const userId = req.user.userId;

    const goal = await BudgetGoal.findOne({ userId });

    if (!goal) {
      return res.status(200).json({
        weeklyBudget: 0,
        monthlyBudget: 0,
      });
    }

    res.status(200).json(goal);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};