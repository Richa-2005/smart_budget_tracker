import Budget from '../model/budget.model.js';
import BudgetGoal from '../model/budgetGoal.model.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayExpenses, weeklyExpenses, monthlyExpenses, budgetGoal] =
      await Promise.all([
        Budget.find({
          userId,
          date: { $gte: startOfToday, $lte: now },
        }),
        Budget.find({
          userId,
          date: { $gte: startOfWeek, $lte: now },
        }),
        Budget.find({
          userId,
          date: { $gte: startOfMonth, $lte: now },
        }),
        BudgetGoal.findOne({ userId }),
      ]);

    const sumPrices = (items) =>
      items.reduce((sum, item) => sum + Number(item.price), 0);

    const todaySpent = sumPrices(todayExpenses);
    const weeklySpent = sumPrices(weeklyExpenses);
    const monthlySpent = sumPrices(monthlyExpenses);

    const necessitySpent = monthlyExpenses
      .filter((item) => item.need === 'necessity')
      .reduce((sum, item) => sum + Number(item.price), 0);

    const miscellaneousSpent = monthlyExpenses
      .filter((item) => item.need === 'miscellaneous')
      .reduce((sum, item) => sum + Number(item.price), 0);

    const weeklyBudget = budgetGoal?.weeklyBudget || 0;
    const monthlyBudget = budgetGoal?.monthlyBudget || 0;

    const remainingWeeklyBudget = weeklyBudget - weeklySpent;
    const remainingMonthlyBudget = monthlyBudget - monthlySpent;

    const recommendations = [];

    if (weeklyBudget > 0 && weeklySpent > weeklyBudget) {
      recommendations.push('You have exceeded your weekly budget.');
    }

    if (monthlyBudget > 0 && monthlySpent > monthlyBudget) {
      recommendations.push('You have exceeded your monthly budget.');
    }

    if (monthlyBudget > 0 && monthlySpent >= 0.8 * monthlyBudget && monthlySpent <= monthlyBudget) {
      recommendations.push('You are close to reaching your monthly budget.');
    }

    if (monthlySpent > 0 && miscellaneousSpent > 0.4 * monthlySpent) {
      recommendations.push(
        'A large portion of your spending is miscellaneous. Try reducing non-essential purchases.'
      );
    }

    if (miscellaneousSpent > necessitySpent && monthlySpent > 0) {
      recommendations.push(
        'Your miscellaneous spending is higher than your necessity spending.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('Your spending looks balanced right now.');
    }

    res.status(200).json({
      todaySpent,
      weeklySpent,
      monthlySpent,
      necessitySpent,
      miscellaneousSpent,
      weeklyBudget,
      monthlyBudget,
      remainingWeeklyBudget,
      remainingMonthlyBudget,
      recommendations,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getWeeklyTrend = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();

    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    const expenses = await Budget.find({
      userId,
      date: { $gte: startOfWeek, $lte: now },
    });

    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    const weeklyData = days.map((dayName, index) => {
      const total = expenses
        .filter(e => new Date(e.date).getDay() === index)
        .reduce((sum, e) => sum + Number(e.price), 0);

      return {
        day: dayName,
        spent: total
      };
    });

    res.status(200).json(weeklyData);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getMonthlyTrend = async (req, res) => {
  try {

    const userId = req.user.userId;
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const expenses = await Budget.find({
      userId,
      date: { $gte: startOfMonth, $lte: now },
    });

    const daysInMonth = now.getDate();

    const monthlyData = [];

    for (let i = 1; i <= daysInMonth; i++) {

      const total = expenses
        .filter(e => new Date(e.date).getDate() === i)
        .reduce((sum, e) => sum + Number(e.price), 0);

      monthlyData.push({
        date: i,
        spent: total
      });
    }

    res.status(200).json(monthlyData);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getRecentExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const recentExpenses = await Budget.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .select('price description need date');

    res.status(200).json(recentExpenses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getInsights = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const expenses = await Budget.find({
      userId,
      date: { $gte: startOfMonth, $lte: now },
    });

    const totalTransactions = expenses.length;

    let highestExpense = null;
    if (expenses.length > 0) {
      highestExpense = expenses.reduce((max, item) =>
        Number(item.price) > Number(max.price) ? item : max
      );
    }

    let necessityCount = 0;
    let miscellaneousCount = 0;

    expenses.forEach((item) => {
      if (item.need === 'necessity') necessityCount++;
      if (item.need === 'miscellaneous') miscellaneousCount++;
    });

    let mostFrequentCategory = 'none';
    if (necessityCount > miscellaneousCount) {
      mostFrequentCategory = 'necessity';
    } else if (miscellaneousCount > necessityCount) {
      mostFrequentCategory = 'miscellaneous';
    } else if (expenses.length > 0) {
      mostFrequentCategory = 'balanced';
    }

    res.status(200).json({
      totalTransactions,
      mostFrequentCategory,
      highestExpense: highestExpense
        ? {
            price: highestExpense.price,
            description: highestExpense.description,
            need: highestExpense.need,
            date: highestExpense.date,
          }
        : null,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


export const getCalendarTotals = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: 'Month and year are required',
      });
    }

    const monthNumber = Number(month);
    const yearNumber = Number(year);

    const startOfMonth = new Date(yearNumber, monthNumber - 1, 1);
    const endOfMonth = new Date(yearNumber, monthNumber, 0, 23, 59, 59, 999);

    const expenses = await Budget.find({
      userId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    const totalsMap = {};

    expenses.forEach((item) => {
      const d = new Date(item.date);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const formattedDate = `${y}-${m}-${day}`;

      if (!totalsMap[formattedDate]) {
        totalsMap[formattedDate] = 0;
      }

      totalsMap[formattedDate] += Number(item.price);
    });

    const result = Object.entries(totalsMap).map(([date, total]) => ({
      date,
      total,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
