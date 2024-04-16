  import mongoose, { Schema } from "mongoose";

  const userSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: String,
    account: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
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
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    transfer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transfer",
      },
    ],
  });

  const User = mongoose.models.User || mongoose.model("User", userSchema);

  export default User;
