import { TransferActivity } from "@/app/(root)/transfer/columns";
import { connectToDB } from "../database";
import Account from "../models/account.model";
import Transfer from "../models/transfer.model";
import User from "../models/user.model";

export async function getAllTransfer(
  userId: string,
): Promise<TransferActivity[]> {
  await connectToDB();

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const transfers = await Transfer.find({
      $or: [{ account_to: user.account }, { account_from: user.account }],
    });

    if (transfers.length === 0) {
      return []; // Return an empty array if no transfers found
    }

    const transferIds = transfers.map((transfer) => ({
      $or: [{ _id: transfer.account_from }, { _id: transfer.account_to }],
    }));

    const transferAccount = await Account.find(
      { $or: transferIds },
      "name color",
    );

    const transferData = transfers.map((transfer) => {
      const accountFrom = transferAccount.find((acc) =>
        acc._id.equals(transfer.account_from),
      );

      const accountTo = transferAccount.find((acc) =>
        acc._id.equals(transfer.account_to),
      );

      // Exclude the account_to and account_from ObjectId
      const { account_from, account_to, __v, ...rest } = transfer._doc;

      return {
        ...rest,
        type: "Transfer",
        user: transfer.user.toString(),
        _id: transfer._id.toString(),
        from: accountFrom?.name,
        to: accountTo?.name,
        fromId: accountFrom?._id.toString(),
        toId: accountTo?._id.toString(),
        fromColor: accountFrom?.color,
        toColor: accountTo?.color,
      };
    });

    return transferData;
  } catch (error) {
    throw new Error("Error getting transfer");
  }
}
