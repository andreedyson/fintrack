import { AccountType, CategoryExpenses } from "@/index";
import { connectToDB } from "../database";
import Account from "../models/account.model";
import Expense from "../models/expense.model";
import Income from "../models/income.model";
import User from "../models/user.model";
import Category from "../models/category.model";

export async function getUserAccount(userId: string): Promise<AccountType[]> {
  await connectToDB();

  try {
    const user = await User.findById(userId).populate("account");

    const account = user.account.map((acc: any) => {
      const incomeIds = acc.income.map((income: any) => income.toString());
      const expenseIds = acc.expense.map((expense: any) => expense.toString());

      return {
        ...acc.toObject(),
        _id: acc._id.toString(),
        user: acc.user.toString(),
        income: incomeIds,
        expense: expenseIds,
      };
    });

    const resolvedAccount = Promise.all(account);

    return resolvedAccount;
  } catch (error) {
    throw new Error("Error finding account");
  }
}

export async function getAccountSum(userId: string) {
  await connectToDB();

  try {
    const user = await User.findById(userId).populate("account");

    let totalAccount = 0;

    if (user && user.account) {
      totalAccount = user.account.reduce(
        (total: number, acc: AccountType) => total + acc.balance,
        0,
      );
    }

    return totalAccount;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getIncomeAccount(userId: string): Promise<AccountType[]> {
  await connectToDB();

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const accounts = await Account.find({ _id: { $in: user.account } })
      .populate("income")
      .select("name balance color");

    const accountsWithIncome = await Promise.all(
      accounts.map(async (account) => {
        const totalIncome = await Income.aggregate([
          {
            $match: { account: account._id },
          },
          {
            $group: {
              _id: "$account",
              totalIncome: { $sum: "$amount" },
            },
          },
        ]);

        return {
          type: "Income",
          name: account.name as string,
          balance: account.balance as string,
          color: account.color as number,
          total: totalIncome.length > 0 ? totalIncome[0].totalIncome : 0,
        } as unknown as AccountType;
      }),
    );

    return accountsWithIncome;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getExpenseAccount(
  userId: string,
): Promise<AccountType[]> {
  await connectToDB();

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const accounts = await Account.find({ _id: { $in: user.account } })
      .populate("expense")
      .select("name balance color");

    const accountsWithExpense = await Promise.all(
      accounts.map(async (account) => {
        const totalExpense = await Expense.aggregate([
          {
            $match: { account: account._id },
          },
          {
            $group: {
              _id: "$account",
              totalExpense: { $sum: "$amount" },
            },
          },
        ]);

        return {
          type: "Expense",
          name: account.name,
          balance: account.balance,
          color: account.color,
          total: totalExpense.length > 0 ? totalExpense[0].totalExpense : 0,
        } as unknown as AccountType;
      }),
    );

    return accountsWithExpense;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getCategoryAccount(
  userId: string,
): Promise<CategoryExpenses[]> {
  await connectToDB();

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const categories = await Category.find({
      _id: { $in: user.category },
    }).select("name budget expense");

    const expenseIds: string[] = categories.flatMap((cat) =>
      cat.expense.map((exp: any) => exp._id.toString()),
    );

    const expenses = await Expense.find({ _id: { $in: expenseIds } });

    const categoryExpenses = categories.map((cat) => {
      const totalAmount = expenses
        .filter((exp) =>
          cat.expense.some((e: any) => e._id.toString() === exp._id.toString()),
        )
        .reduce((acc, exp) => acc + exp.amount, 0);

      return {
        _id: cat._id.toString(),
        name: cat.name,
        budget: cat.budget,
        totalExpenses: totalAmount,
      };
    });

    return categoryExpenses;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
