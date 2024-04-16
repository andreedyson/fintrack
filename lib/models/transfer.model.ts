import mongoose, { Schema } from "mongoose";

const transferSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  account_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  account_from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
});

const Transfer =
  mongoose.models.Transfer || mongoose.model("Transfer", transferSchema);

export default Transfer;
