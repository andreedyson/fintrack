import { connectToDB } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Category from "@/lib/models/category.model";
import { CategoryType } from "@/index";
import Expense from "@/lib/models/expense.model";
import Account from "@/lib/models/account.model";

export async function POST(req: NextRequest) {
  const { name, budget, userId } = await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId).populate("category");
    const categoryExists = user.category.some(
      (category: CategoryType) => category.name === name,
    );

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to add a category" },
        { status: 401 },
      );
    }

    if (categoryExists) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 409 },
      );
    }

    const category = new Category({
      name: name,
      user: userId,
      budget: budget,
    });

    await category.save();

    user.category.push(category._id);
    await user.save();

    return NextResponse.json(
      { message: "Category created successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating category" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const { userId, categoryId, newName, newBudget } = await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);
    const category = await Category.findById(categoryId);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to edit this Category" },
        { status: 401 },
      );
    }

    if (!category) {
      return NextResponse.json(
        { message: "Category does not exists" },
        { status: 404 },
      );
    }

    category.name = newName;
    category.budget = newBudget;

    await category.save();

    return NextResponse.json(
      { message: "Category edited successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error editing category" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { userId, categoryId } = await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);
    const category = await Category.findById(categoryId);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to delete this category" },
        { status: 401 },
      );
    }

    if (!category) {
      return NextResponse.json(
        { message: "Category does not exists" },
        { status: 404 },
      );
    }

    const expenses = await Expense.find({ category: categoryId });

    for (const expense of expenses) {
      const account = await Account.findById(expense.account);
      account.balance += expense.amount;

      account.expense.pull(expense._id);

      await Expense.findByIdAndDelete(expense._id);
      await account.save();
    }

    await Category.findByIdAndDelete(categoryId);

    user.category.pull(categoryId);
    await user.save();

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting category" },
      { status: 500 },
    );
  }
}
