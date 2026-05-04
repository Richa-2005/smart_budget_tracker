import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    mlPredicted: {
      type: Boolean,
      default: false,
    },
    categoryConfidence: {
      type: Number,
      default: 0,
    },
    needConfidence: {
      type: Number,
      default: 0,
    },
    need: {
      type: String,
      required: true,
      enum: ['necessity', 'miscellaneous'],
      lowercase: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;