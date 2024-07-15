import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/ui/data-table";
import { UserProvider } from "@/lib/context/UserContext";

import {
  getExpenseAccount,
  getUserAccount,
} from "@/lib/actions/account.actions";

import TransactionPieChart from "@/components/chart/TransactionPieChart";
import BarChart from "@/components/chart/BarChart";
import { getAllExpense } from "@/lib/actions/expense.actions";
import TransactionLineChart from "@/components/chart/TransactionLineChart";
import AddExpenseBtn from "@/components/action/AddExpenseBtn";
import { getAccountCategory } from "@/lib/actions/category.actions";

async function ExpensePage() {
  const session: any = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [allExpenses, userAccount, userCategory, expenseAccount] =
    await Promise.all([
      getAllExpense(userId),
      getUserAccount(userId),
      getAccountCategory(userId),
      getExpenseAccount(userId),
    ]);

  return (
    <section className="mb-6 px-4 md:px-0">
      <div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:grid-rows-4">
          {/* Expense Line Chart */}
          <div className="lg:col-span-2 lg:row-span-2">
            <div className="h-full w-full space-y-4 rounded-md border-2 bg-background p-4 dark:bg-accent/60 md:col-span-2">
              <h3 className="border-b-2 pb-2 text-base font-bold dark:border-foreground/20 md:text-lg">
                Insights
              </h3>
              <div className="h-[300px] md:h-[480px]">
                <TransactionLineChart transactionType="expense" />
              </div>
            </div>
          </div>

          {/* Expense Donut and Bar Chart */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-3">
            <div className="h-full w-full space-y-4 rounded-md border-2 bg-background p-4 dark:bg-accent/60 md:col-span-2">
              <h3 className="border-b-2 pb-2 text-base font-bold dark:border-foreground/20 md:text-lg">
                Expense Overview
              </h3>
              <Tabs defaultValue="donut" className="w-full">
                <TabsList className="flex w-full gap-4">
                  <TabsTrigger value="donut" className="w-full lg:w-[220px]">
                    Donut Chart
                  </TabsTrigger>
                  <TabsTrigger value="bar" className="w-full lg:w-[220px]">
                    Bar Chart
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="donut" className="mt-4 h-full">
                  <div className="h-full md:min-h-[430px]">
                    <TransactionPieChart accountData={expenseAccount} />
                  </div>
                </TabsContent>
                <TabsContent value="bar" className="mt-4 h-full">
                  <div className="h-[320px] md:h-[430px]">
                    <BarChart accountData={expenseAccount} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Expense Activity Table */}
          <div className="lg:col-span-3 lg:col-start-3 lg:row-span-4 lg:row-start-1">
            <div className="h-full w-full space-y-4 rounded-md border-2 bg-background p-4 dark:bg-accent/60 md:col-span-2">
              <h3 className="border-b-2 pb-2 text-base font-bold dark:border-foreground/20 md:text-lg">
                Expense Activity
              </h3>
              <div>
                <AddExpenseBtn
                  accounts={userAccount}
                  categories={userCategory}
                />
                <UserProvider accounts={userAccount} categories={userCategory}>
                  <DataTable columns={columns} data={allExpenses} />
                </UserProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExpensePage;
