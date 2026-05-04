import Budget from '../model/budget.model.js';
import BudgetGoal from '../model/budgetGoal.model.js';
import axios from 'axios';

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

export const getCategorySummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const expenses = await Budget.find({
      userId,
      date: { $gte: startOfMonth, $lte: now },
    });

    const categoryMap = {};

    expenses.forEach((item) => {
      const cat = item.category || 'Uncategorized';
      if (!categoryMap[cat]) {
        categoryMap[cat] = 0;
      }
      categoryMap[cat] += Number(item.price);
    });

    const result = Object.entries(categoryMap).map(([category, total]) => ({
      category,
      total,
    }));

    result.sort((a, b) => b.total - a.total);

    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getRisk = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const [weeklyExpenses, monthlyExpenses, budgetGoal] = await Promise.all([
      Budget.find({ userId, date: { $gte: startOfWeek, $lte: now } }),
      Budget.find({ userId, date: { $gte: startOfMonth, $lte: now } }),
      BudgetGoal.findOne({ userId }),
    ]);

    const sumPrices = (items) => items.reduce((sum, item) => sum + Number(item.price), 0);
    const weeklySpent = sumPrices(weeklyExpenses);
    const monthlySpent = sumPrices(monthlyExpenses);
    
    const weeklyBudget = budgetGoal?.weeklyBudget || 0;
    const monthlyBudget = budgetGoal?.monthlyBudget || 0;
    
    const daysPassedInMonth = now.getDate();
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const avgDailySpend = daysPassedInMonth > 0 ? monthlySpent / daysPassedInMonth : 0;
    
    const miscellaneousSpent = monthlyExpenses
      .filter((item) => item.need === 'miscellaneous')
      .reduce((sum, item) => sum + Number(item.price), 0);
      
    const miscRatio = monthlySpent > 0 ? miscellaneousSpent / monthlySpent : 0;
    const transactionCount = monthlyExpenses.length;

    const payload = {
      weeklySpent,
      monthlySpent,
      weeklyBudget,
      monthlyBudget,
      daysPassed: daysPassedInMonth,
      totalDays: totalDaysInMonth,
      avgDailySpend,
      miscRatio,
      transactionCount
    };

    const daysRemaining = totalDaysInMonth - daysPassedInMonth;
    let reason = "Your spending looks normal.";
    if (daysPassedInMonth > 0 && monthlyBudget > 0) {
      const budgetUsedPercent = Math.round((monthlySpent / monthlyBudget) * 100);
      reason = `${budgetUsedPercent}% of budget used with ${daysRemaining} days remaining`;
    }

    try {
      const mlResponse = await axios.post('http://localhost:8000/predict-risk', payload);
      res.status(200).json({
        ...mlResponse.data,
        reason
      });
    } catch (mlError) {
      console.error('ML Risk Service Error:', mlError.message);
      // Fallback response
      res.status(200).json({ riskLevel: 'low', confidence: 0.0, reason: "Unable to reach AI service." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [monthlyExpenses, budgetGoal] = await Promise.all([
      Budget.find({ userId, date: { $gte: startOfMonth, $lte: now } }),
      BudgetGoal.findOne({ userId }),
    ]);

    const monthlySpent = monthlyExpenses.reduce((sum, item) => sum + Number(item.price), 0);
    const monthlyBudget = budgetGoal?.monthlyBudget || 0;
    const miscellaneousSpent = monthlyExpenses
      .filter((item) => item.need === 'miscellaneous')
      .reduce((sum, item) => sum + Number(item.price), 0);

    const categoryMap = {};
    monthlyExpenses.forEach((item) => {
      const cat = item.category || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(item.price);
    });

    let highestCategory = null;
    let highestCategoryAmount = 0;
    Object.entries(categoryMap).forEach(([cat, amount]) => {
      if (amount > highestCategoryAmount) {
        highestCategoryAmount = amount;
        highestCategory = cat;
      }
    });

    const recommendations = [];

    // Rule 1: High category spend
    if (highestCategory && monthlySpent > 0) {
      const catRatio = highestCategoryAmount / monthlySpent;
      if (catRatio > 0.3) {
        recommendations.push({
          message: `${highestCategory} spending is ${Math.round(catRatio * 100)}% of your total. Reducing some weekly orders can save approx ₹${Math.round(highestCategoryAmount * 0.2)}.`,
          type: 'insight'
        });
      }
    }

    // Rule 2: Budget closeness
    if (monthlyBudget > 0) {
      if (monthlySpent > monthlyBudget) {
        recommendations.push({
          message: 'You have exceeded your monthly budget! Try to minimize any further expenses.',
          type: 'warning'
        });
      } else if (monthlySpent > 0.8 * monthlyBudget) {
        recommendations.push({
          message: 'You are close to your monthly budget. Limit miscellaneous expenses.',
          type: 'warning'
        });
      }
    }

    // Rule 3: Misc ratio
    if (monthlySpent > 0 && (miscellaneousSpent / monthlySpent) > 0.4) {
      recommendations.push({
        message: 'Miscellaneous expenses make up a large portion of your spending. Review them to find savings.',
        type: 'tip'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        message: 'Your spending looks healthy and balanced. Keep it up!',
        type: 'insight'
      });
    }

    res.status(200).json(recommendations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
