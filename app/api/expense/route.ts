import { connectToDB } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Account from "@/lib/models/account.model";
import Expense from "@/lib/models/expense.model";
import Category from "@/lib/models/category.model";

export async function POST(req: NextRequest) {
  const { name, date, amount, userId, accountId, categoryId } =
    await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);
    const account = await Account.findById(accountId);
    const category = await Category.findById(categoryId);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to add an income" },
        { status: 401 },
      );
    }

    if (name.length < 4) {
      return NextResponse.json(
        { message: "The income name should be atleast 4 characters" },
        { status: 400 },
      );
    }

    if (account.balance === 0) {
      return NextResponse.json(
        { message: "You don't have any balance in that account" },
        { status: 409 },
      );
    }

    if (amount < 0) {
      return NextResponse.json(
        { message: "The amount must be greater than 0" },
        { status: 409 },
      );
    }

    if (amount > account.balance) {
      return NextResponse.json(
        { message: "Expense amount exceeds available balacne" },
        { status: 403 },
      );
    }

    const expense = new Expense({
      user: userId,
      name: name,
      date: date,
      amount: amount,
      account: accountId,
      category: categoryId,
    });

    account.balance -= amount;
    category.expense.push(expense._id);

    await expense.save();
    user.expense.push(expense._id);
    account.expense.push(expense._id);

    await user.save();
    await account.save();
    await category.save();

    return NextResponse.json(
      { message: "Expense added successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating expense" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const {
    userId,
    expenseId,
    newName,
    newDate,
    newAmount,
    newAccount,
    newCategory,
  } = await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);
    const expense = await Expense.findById(expenseId);
    const account = await Account.findById(expense.account);
    const category = await Category.findById(expense.category);
    const newAcc = await Account.findById(newAccount);
    const newCat = await Category.findById(newCategory);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to edit this expense" },
        { status: 401 },
      );
    }

    if (!expense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 },
      );
    }

    if (newName.length < 4) {
      return NextResponse.json(
        { message: "Expense name should be atleast 4 characters" },
        { status: 400 },
      );
    }

    if (newAcc.balance === 0) {
      return NextResponse.json(
        { message: "You don't have any balance in that account" },
        { status: 409 },
      );
    }

    if (newAmount < 0) {
      return NextResponse.json(
        { message: "Amount must be greater than 0" },
        { status: 409 },
      );
    }

    if (newAmount > newAcc.balance) {
      return NextResponse.json(
        { message: "Expense amount exceeds available balacne" },
        { status: 403 },
      );
    }

    // Account Change validation
    if (expense.account._id.toString() !== newAccount) {
      account.expense.pull(expenseId);
      account.balance += expense.amount;

      newAcc.expense.push(expenseId);
      newAcc.balance -= newAmount;
      await newAcc.save();
    }

    // Category Change validation
    if (expense.category._id.toString() !== newCategory) {
      category.expense.pull(expenseId);
      newCat.expense.push(expenseId);

      await newCat.save();
    }

    const oldAmount = expense.amount;
    const difference = newAmount - oldAmount;

    expense.name = newName;
    expense.date = newDate;
    expense.amount = newAmount;
    expense.account = newAccount;
    expense.category = newCategory;

    account.balance -= difference;

    await expense.save();
    await account.save();
    await category.save();

    return NextResponse.json(
      { message: "Expense updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating expense" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { userId, expenseId } = await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);
    const expense = await Expense.findById(expenseId);
    const account = await Account.findById(expense.account);
    const category = await Category.findById(expense.category);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to edit this expense" },
        { status: 401 },
      );
    }

    if (!expense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 },
      );
    }

    account.balance += expense.amount;
    user.expense.pull(expenseId);
    account.expense.pull(expenseId);
    category.expense.pull(expenseId);

    await Expense.findByIdAndDelete(expenseId);
    await account.save();
    await category.save();
    await user.save();

    return NextResponse.json(
      { message: "Expense deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting expense" },
      { status: 500 },
    );
  }
}
