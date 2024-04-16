import Expense from "../models/expense.model";
import { connectToDB } from "../database";
import Account from "../models/account.model";
import User from "../models/user.model";
import { TransactionHighest, TransactionType } from "@/index";
import { TransactionActivity } from "@/components/table/columns";
import Category from "../models/category.model";

export async function getAllExpense(
  userId: string,
): Promise<TransactionActivity[]> {
  await connectToDB();

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const expenses = await Expense.find({ account: { $in: user.account } })
      .select("name date amount account category")
      .exec();

    const accountIds = expenses.map((expense) => expense.account);
    const categoryIds = expenses.map((expense) => expense.category);

    const accounts = await Account.find(
      { _id: { $in: accountIds } },
      "name color",
    );

    const categories = await Category.find(
      { _id: { $in: categoryIds } },
      "name color",
    );

    const expensesWithType = expenses.map((expense) => {
      const account = accounts.find((account: any) =>
        account._id.equals(expense.account),
      );

      const category = categories.find((category: any) =>
        category._id.equals(expense.category),
      );

      return {
        ...expense._doc,
        type: "Expense",
        _id: expense._id.toString(),
        accountId: expense.account.toString(),
        categoryId: expense.category.toString(),
        category: category ? category.name : null,
        account: account ? account.name : null,
        color: account ? account.color : null,
      };
    });

    return expensesWithType;
  } catch (error) {
    throw new Error("Error getting expense");
  }
}

export async function getExpenseSum(userId: string): Promise<number> {
  await connectToDB();

  try {
    const user = await User.findById(userId).populate("expense");

    let totalExpense = 0;

    if (user && user.expense) {
      totalExpense = user.expense.reduce(
        (total: number, expense: any) => total + expense.amount,
        0,
      );
    }

    return totalExpense;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getHighestSpending(
  userId: string,
  selectedValue: string,
): Promise<TransactionHighest[]> {
  await connectToDB();

  try {
    const user = await User.findById(userId).populate("expense");

    const currentDate = new Date();
    let startDate, endDate;

    switch (selectedValue) {
      case "week":
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 6);

        endDate = currentDate;
        break;
      case "month":
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
        );
        break;
      case "all":
        startDate = new Date(0);
        endDate = new Date();
        break;
      default:
        throw new Error("Invalid timespan specified");
    }

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .select("name date amount account")
      .sort({ amount: -1 })
      .limit(3)
      .populate("account", "name")
      .exec();

    const highestSpending = expenses.map((expense: any) => ({
      type: "Expense",
      _id: expense._id.toString(),
      name: expense.name,
      date: new Date(expense.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      amount: expense.amount,
    }));

    return highestSpending;
  } catch (error) {
    throw new Error("Error getting highest spending");
  }
}

export async function getExpenseByTimespan(
  userId: string,
  timespan: string,
): Promise<TransactionType[]> {
  await connectToDB();

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const currentDate = new Date();
    let startDate, endDate;

    switch (timespan) {
      case "week":
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 6);

        endDate = currentDate;
        break;
      case "month":
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
        );
        break;
      case "all":
        startDate = new Date(0);
        endDate = new Date();
        break;
      default:
        throw new Error("Invalid timespan specified");
    }

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const expensesWithType = expenses.map((expense: any) => ({
      ...expense.toObject(),
      type: "Expense",
    }));

    return expensesWithType;
  } catch (error) {
    throw new Error("Error getting income data by timespan");
  }
}
