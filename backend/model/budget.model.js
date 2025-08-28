import mongoose from "mongoose"

const budgetSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',      
        required: true
      },
      price: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      need: {
        type: String,
        required: true,
         
      },
      date: {
        type: Date,
        required: true,
        default: Date.now, 
      }

}, {
    timestamps:true  
})

const Budget= mongoose.model('Budget',budgetSchema)

export default Budget;