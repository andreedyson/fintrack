import { connectToDB } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Account from "@/lib/models/account.model";
import Transfer from "@/lib/models/transfer.model";

export async function POST(req: NextRequest) {
  const { userId, account_fromId, account_toId, name, date, amount } =
    await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to add a transfer" },
        { status: 401 },
      );
    }

    if (name.length < 4) {
      return NextResponse.json(
        { message: "Transfer name should be atleast 4 characters" },
        { status: 400 },
      );
    }

    const accountFrom = await Account.findById(account_fromId);
    const accountTo = await Account.findById(account_toId);

    if (!account_fromId || !account_toId) {
      return NextResponse.json(
        { message: "You need to add an account to add a transfer" },
        { status: 400 },
      );
    }

    if (account_fromId === account_toId) {
      return NextResponse.json(
        { message: "You can't transfer to the same account" },
        { status: 409 },
      );
    }

    if (accountFrom.balance === 0) {
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

    if (!accountFrom || !accountTo) {
      return NextResponse.json(
        { message: "Account does not exists" },
        { status: 404 },
      );
    }

    const transfer = new Transfer({
      name: name,
      date: date,
      amount: amount,
      account_from: account_fromId,
      account_to: account_toId,
      user: userId,
    });

    accountFrom.balance -= amount;
    accountTo.balance += amount;

    await transfer.save();
    user.transfer.push(transfer._id);

    await user.save();
    await accountFrom.save();
    await accountTo.save();

    return NextResponse.json(
      { message: "Transfer added successfully" },
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
    transferId,
    userId,
    newName,
    newDate,
    newAccountTo,
    newAccountFrom,
    newAmount,
  } = await req.json();

  await connectToDB();
  try {
    const user = await User.findById(userId);
    const transfer = await Transfer.findById(transferId);

    if (!user) {
      return NextResponse.json(
        { message: "You need to be authenticated to edit this expense" },
        { status: 401 },
      );
    }

    if (!transfer) {
      return NextResponse.json(
        { message: "Transfer not found" },
        { status: 404 },
      );
    }

    const oldAccountFrom = await Account.findById(transfer.account_from);
    const oldAccountTo = await Account.findById(transfer.account_to);

    const newAccFrom = await Account.findById(newAccountFrom);
    const newAccTo = await Account.findById(newAccountTo);

    if (!oldAccountFrom || !oldAccountTo) {
      return NextResponse.json(
        {
          message:
            "One or both accounts associated with the transfer not found",
        },
        { status: 404 },
      );
    }

    if (newAccountFrom === newAccountTo) {
      return NextResponse.json(
        { message: "You can't transfer to the same account" },
        { status: 409 },
      );
    }

    if (newName.length < 4) {
      return NextResponse.json(
        { message: "Expense name should be atleast 4 characters" },
        { status: 400 },
      );
    }

    if (newAccFrom.balance === 0) {
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

    // Check the difference between old and new amount
    const oldAmount = transfer.amount;

    const accountFromChanged =
      newAccountFrom !== transfer.account_from.toString();
    const accountToChanged = newAccountTo !== transfer.account_to.toString();

    if (accountFromChanged && newAccFrom.balance - newAmount <= 0) {
      return NextResponse.json(
        { message: "You won't have any balance in the source account" },
        { status: 409 },
      );
    }

    if (accountFromChanged) {
      oldAccountFrom.balance += oldAmount; // Add the old amount back to old account
      newAccFrom.balance -= newAmount;
    }

    if (accountToChanged) {
      oldAccountTo.balance -= oldAmount; // Add the old amount back to old account
      newAccTo.balance += newAmount;
    }

    const amountChanged = newAmount !== transfer.amount;

    if (amountChanged) {
      const difference = newAmount - oldAmount;

      oldAccountFrom.balance -= difference;
      oldAccountTo.balance += difference;

      transfer.amount = newAmount;
    }

    await oldAccountFrom.save();
    await oldAccountTo.save();
    await newAccFrom.save();
    await newAccTo.save();

    // Update Expense data
    transfer.name = newName;
    transfer.date = newDate;
    transfer.amount = newAmount;
    transfer.account_from = newAccountFrom;
    transfer.account_to = newAccountTo;

    await transfer.save();

    return NextResponse.json(
      { message: "Transfer updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating transfer" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { userId, transferId } = await req.json();

  await connectToDB();

  try {
    const user = await User.findById(userId);
    const transfer = await Transfer.findById(transferId);

    if (!transfer) {
      return NextResponse.json(
        { message: "Transfer not found" },
        { status: 404 },
      );
    }

    const accountFrom = await Account.findById(transfer.account_from);
    const accountTo = await Account.findById(transfer.account_to);

    if (!accountFrom || !accountTo) {
      return NextResponse.json(
        {
          message:
            "One or both accounts associated with the transfer not found",
        },
        { status: 404 },
      );
    }

    accountFrom.balance += transfer.amount;
    accountTo.balance -= transfer.amount;

    user.transfer.pull(transferId);

    await Transfer.findByIdAndDelete(transferId);

    await accountFrom.save();
    await accountTo.save();
    await user.save();

    return NextResponse.json(
      { message: "Transfer deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting transfer" },
      { status: 500 },
    );
  }
}
