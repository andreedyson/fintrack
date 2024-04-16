import AddAccountBtn from "./AddAccountBtn";
import AddIncomeBtn from "./AddIncomeBtn";
import AddExpenseBtn from "./AddExpenseBtn";
import AddTransferBtn from "./AddTransferBtn";
import AddCategoryBtn from "./AddCategoryBtn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getUserAccount } from "@/lib/actions/account.actions";
import { getAccountCategory } from "@/lib/actions/category.actions";
import { cn } from "@/lib/utils";

type Props = {
  isHorizontal?: boolean;
};

async function QuickActions({ isHorizontal }: Props) {
  const session: any = await getServerSession(authOptions);

  const userId = session?.user?.id;

  const userAccount = await getUserAccount(userId);
  const userCategory = await getAccountCategory(userId);

  return (
    <div
      className={cn(
        "flex flex-row items-center gap-x-2",
        isHorizontal && "flex-col gap-y-4",
      )}
    >
      <AddAccountBtn />
      <AddCategoryBtn />
      <AddIncomeBtn accounts={userAccount} />
      <AddExpenseBtn accounts={userAccount} categories={userCategory} />
      <AddTransferBtn accounts={userAccount} />
    </div>
  );
}

export default QuickActions;
