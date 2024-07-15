import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  getExpenseAccount,
  getIncomeAccount,
  getUserAccount,
} from "@/lib/actions/account.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AccountCard from "@/components/card/AccountCard";
import BarChart from "@/components/chart/BarChart";
import { getAllIncome } from "@/lib/actions/income.actions";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/table/columns";
import { getAllExpense } from "@/lib/actions/expense.actions";
import { UserProvider } from "@/lib/context/UserContext";
import { getAccountCategory } from "@/lib/actions/category.actions";

async function AccountPage() {
  const session: any = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [
    allAcc,
    incomeAccount,
    expenseAccount,
    userCategory,
    allIncomes,
    allExpenses,
  ] = await Promise.all([
    getUserAccount(userId),
    getIncomeAccount(userId),
    getExpenseAccount(userId),
    getAccountCategory(userId),
    getAllIncome(userId),
    getAllExpense(userId),
  ]);

  return (
    <section className="mb-6 px-4 md:px-0">
      <div className="space-y-4">
        {/* Accounts Card */}
        <div className="h-full w-full space-y-4 md:mb-6">
          <h3 className="text-base font-bold md:text-lg">Account (s)</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {allAcc.length ? (
              allAcc.map((card) => (
                <div key={card._id}>
                  <AccountCard account={card} />
                </div>
              ))
            ) : (
              <div className="text-lg font-semibold underline">
                You haven&apos;t added any accounts yet.
              </div>
            )}
          </div>
        </div>

        {/* Account Donut Chart */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <div className="col-span-2 h-full w-full space-y-4 rounded-md border-2 p-4 shadow-md dark:bg-accent/60">
            <div className="flex items-center justify-between border-b-2 pb-3 dark:border-foreground/20">
              <h3 className="text-base font-bold md:text-lg">
                Income Overview
              </h3>
              <Link
                href={"/income"}
                className="flex items-center font-semibold duration-300 hover:text-main-cyan"
              >
                View Income <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex h-[300px] w-full items-center">
              <BarChart accountData={incomeAccount} />
            </div>
          </div>

          <div className="col-span-2 space-y-4 rounded-md border-2 p-4 shadow-md dark:bg-accent/60">
            <div className="flex items-center justify-between border-b-2 pb-3 dark:border-foreground/20">
              <h3 className="text-base font-bold md:text-lg">
                Expense Overview
              </h3>
              <Link
                href={"/expense"}
                className="flex items-center font-semibold duration-300 hover:text-main-cyan"
              >
                View Expense <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex h-[300px] w-full items-center">
              <BarChart accountData={expenseAccount} />
            </div>
          </div>
        </div>

        {/* Activity Table Card */}
        <div className="w-full space-y-4 rounded-md border-2 bg-background p-4 shadow-md dark:bg-accent/60">
          <h3 className="border-b-2 pb-3 text-base font-bold dark:border-foreground/20 md:text-lg">
            Activities
          </h3>

          {/* Account Activity Income & Expense Table */}
          <UserProvider accounts={allAcc} categories={userCategory}>
            <div className="grid grid-cols-1 gap-y-8">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold md:text-lg">Income</h3>
                </div>
                <div>
                  <DataTable columns={columns} data={allIncomes} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold md:text-lg">Expense</h3>
                </div>
                <div>
                  <DataTable columns={columns} data={allExpenses} />
                </div>
              </div>
            </div>
          </UserProvider>
        </div>
      </div>
    </section>
  );
}

export default AccountPage;
