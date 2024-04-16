import { TransactionType } from "@/index";
import { connectToDB } from "../database";
import Account from "../models/account.model";
import Income from "../models/income.model";
import User from "../models/user.model";
import { TransactionActivity } from "@/components/table/columns";

export async function getAllIncome(
  userId: string,
): Promise<TransactionActivity[]> {
  await connectToDB();

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const incomes = await Income.find({ account: { $in: user.account } })
      .select("name date amount account")
      .exec();

    const accountIds = incomes.map((income) => income.account);

    const accounts = await Account.find(
      { _id: { $in: accountIds } },
      "name color",
    );

    const incomesWithType = incomes.map((income) => {
      const account = accounts.find((account: any) =>
        account._id.equals(income.account),
      );

      return {
        ...income._doc,
        type: "Income",
        _id: income._id.toString(),
        accountId: income.account._id.toString(),
        account: account ? account.name : null,
        color: account ? account.color : null,
      };
    });

    return incomesWithType;
  } catch (error) {
    throw new Error("Error getting all income data");
  }
}

export async function getIncomeByTimespan(
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

    const incomes = await Income.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const incomesWithType = incomes.map((income: any) => ({
      ...income.toObject(),
      type: "Income",
    }));

    return incomesWithType;
  } catch (error) {
    throw new Error("Error getting income data by timespan");
  }
}

export async function getIncomeSum(userId: string): Promise<number> {
  await connectToDB();

  try {
    const user = await User.findById(userId).populate("income");

    let totalIncome = 0;

    if (user && user.income) {
      totalIncome = user.income.reduce(
        (total: number, income: any) => total + income.amount,
        0,
      );
    }

    return totalIncome;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
