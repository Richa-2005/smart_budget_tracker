import Budget from '../model/budget.model.js';
import mongoose from 'mongoose';

export const getBudget = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.userId;

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const expenditures = await Budget.find({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ createdAt: 1 });

    res.status(200).json(expenditures);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const postBudget = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.userId;
    const { price, description, need } = req.body;

    if (!price || !description || !need) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const normalizedNeed = need.toLowerCase();

    if (!['necessity', 'miscellaneous'].includes(normalizedNeed)) {
      return res.status(400).json({
        message: 'Need must be either necessity or miscellaneous',
      });
    }

    const newBudget = await Budget.create({
      userId,
      date: new Date(date),
      price,
      description,
      need: normalizedNeed,
    });

    res.status(201).json({
      message: 'Budget expenditure added successfully.',
      data: newBudget,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const { _id } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: 'Invalid expenditure ID format.' });
    }

    const deletedBudget = await Budget.findOneAndDelete({
      _id,
      userId,
    });

    if (!deletedBudget) {
      return res.status(404).json({ message: 'Expenditure not found.' });
    }

    res.status(200).json({
      message: 'Expenditure deleted successfully.',
      data: deletedBudget,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};