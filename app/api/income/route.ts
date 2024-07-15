import { connectToDB } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Account from "@/lib/models/account.model";
import Income from "@/lib/models/income.model";

export async function POST(req: NextRequest) {
  const { name, date, amount, userId, accountId } = await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);
    const account = await Account.findById(accountId);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to add an income" },
        { status: 401 },
      );
    }

    if (name.length < 4) {
      return NextResponse.json(
        { message: "Income name should be atleast 4 characters" },
        { status: 400 },
      );
    }

    if (amount < 0) {
      return NextResponse.json(
        { message: "The amount must be greater than 0" },
        { status: 409 },
      );
    }

    const income = new Income({
      user: userId,
      name: name,
      date: date,
      amount: amount,
      account: accountId,
    });

    await income.save();
    account.balance += amount;
    user.income.push(income._id);
    account.income.push(income._id);

    await user.save();
    await account.save();

    return NextResponse.json(
      { message: "Income added successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating income" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const { userId, incomeId, newName, newDate, newAmount, newAccount } =
    await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);
    const income = await Income.findById(incomeId);
    const account = await Account.findById(income.account);
    const newAcc = await Account.findById(newAccount);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to edit this income" },
        { status: 401 },
      );
    }

    if (!income) {
      return NextResponse.json(
        { message: "Income not found" },
        { status: 404 },
      );
    }

    if (newName.length < 4) {
      return NextResponse.json(
        { message: "Income name should be atleast 4 characters" },
        { status: 400 },
      );
    }

    if (newAmount < 0) {
      return NextResponse.json(
        { message: "The amount must be greater than 0" },
        { status: 409 },
      );
    }

    // Account Change Validation
    if (income.account._id.toString() !== newAccount) {
      account.income.pull(incomeId);
      account.balance -= income.amount;

      newAcc.income.push(incomeId);
      newAcc.balance += newAmount;
      await newAcc.save();
    }

    const oldAmount = income.amount;
    const difference = newAmount - oldAmount;

    account.balance += difference;

    income.name = newName;
    income.date = newDate;
    income.amount = newAmount;
    income.account = newAccount;

    await income.save();
    await account.save();

    return NextResponse.json(
      { message: "Income updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating income" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { userId, incomeId } = await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);
    const income = await Income.findById(incomeId);
    const account = await Account.findById(income.account);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to delete this income" },
        { status: 401 },
      );
    }

    if (!income) {
      return NextResponse.json(
        { message: "Income not found" },
        { status: 404 },
      );
    }

    account.balance -= income.amount;
    user.income.pull(incomeId);
    account.income.pull(incomeId);

    await Income.findByIdAndDelete(incomeId);
    await user.save();
    await account.save();

    return NextResponse.json(
      { message: "Income deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting expense" },
      { status: 500 },
    );
  }
}
