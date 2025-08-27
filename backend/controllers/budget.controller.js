import Budget from '../models/Budget.js'; 
import mongoose from 'mongoose'; 

export const getBudget = async (req, res) => {
  try {
    const { userId, date } = req.params;

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const expenditures = await Budget.find({
      userId: userObjectId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ createdAt: 1 });

    if (expenditures.length > 0) {
      return res.status(200).json(expenditures);
    } else {
      return res.status(404).json({ message: 'No expenditures found for this user and date.' });
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format.' });
    }
    res.status(500).send('Server Error');
  }
};

export const postBudget = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const { price, description, need } = req.body;

  
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const newBudget = await Budget.create({
      userId: userObjectId,
      date: new Date(date),
      price,
      description,
      need,
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

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Invalid expenditure ID format.' });
    }

    const deletedBudget = await Budget.findByIdAndDelete(_id);

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