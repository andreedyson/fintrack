import { Types } from "mongoose";
import { connectToDB } from "../database";
import User from "../models/user.model";
import Category from "../models/category.model";
import { CategoryType } from "@/index";
import Account from "../models/account.model";
import Expense from "../models/expense.model";

export async function getAccountCategory(
  userId: string,
): Promise<CategoryType[]> {
  await connectToDB();

  try {
    const user = await User.findById(userId).populate("category");

    const categoryName = user.category.map(
      async (categoryId: Types.ObjectId) => {
        const category = await Category.findById(categoryId);
        return { _id: category?._id.toString(), name: category?.name };
      },
    );

    const resolvedCategory = Promise.all(categoryName);

    return resolvedCategory;
  } catch (error) {
    throw new Error("Error finding account");
  }
}

export async function getExpenseBycategory(userId: string) {
  await connectToDB();

  try {
    const user = await User.findById(userId).populate({
      path: "category",
      populate: {
        path: "expense",
        model: "Expense",
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const expenses = await Promise.all(
      user.category.flatMap(async (category: any) => {
        return await Promise.all(
          category.expense.map(async (expense: any) => {
            const account = await Account.findById(expense.account._id);

            return {
              _id: expense._id.toString(),
              type: "Expense",
              name: expense.name,
              date: expense.date,
              amount: expense.amount,
              account: account.name,
              color: account.color,
              category: category.name,
              accountId: expense.account._id.toString(),
              categoryId: category._id.toString(),
            };
          }),
        );
      }),
    );

    return expenses.flat();
  } catch (error) {
    throw new Error("Error finding category expenses");
  }
}

export async function getCategoryLinechart(userId: string) {
  await connectToDB();

  try {
    const user = await User.findById(userId).populate("category");

    const categoryIds = user.category.map((cat: any) => cat._id);
    const categories = await Category.find({ _id: { $in: categoryIds } });

    const categoriesExpenses = categories.flatMap((cat) =>
      cat.expense.map((exp: any) => exp._id.toString()),
    );
    const expenses = await Expense.find(
      { _id: { $in: categoriesExpenses } },
      "name date amount category",
    );

    const categoryMap: { [key: string]: any } = {};

    expenses.forEach((expense) => {
      const category = categories.find((cat: any) =>
        cat._id.equals(expense.category),
      );

      const categoryId = category._id.toString();
      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = {
          categoryId,
          categoryName: category.name,
          expenses: {},
        };
      }

      const expenseDate = new Date(expense.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      if (!categoryMap[categoryId].expenses[expenseDate]) {
        categoryMap[categoryId].expenses[expenseDate] = 0;
      }

      categoryMap[categoryId].expenses[expenseDate] += expense.amount;
    });

    // Convert aggregated expenses object to array format
    const lineChartData = Object.values(categoryMap).map((category: any) => ({
      ...category,
      expenses: Object.keys(category.expenses).map((expenseDate) => ({
        expenseDate,
        expenseAmount: category.expenses[expenseDate],
      })),
    }));

    return lineChartData;
  } catch (error) {
    throw new Error("Error finding category");
  }
}
