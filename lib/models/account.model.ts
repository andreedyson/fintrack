import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  balance: Number,
  color: {
    type: String,
    required: true,
  },
  income: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Income",
    },
  ],
  expense: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
});

const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);

export default Account;
