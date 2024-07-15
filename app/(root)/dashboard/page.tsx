import OverviewCard from "@/components/card/OverviewCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/ui/data-table";
import DonutChart from "@/components/chart/DonutChart";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import QuickActions from "@/components/action/QuickActions";
import { getAllIncome, getIncomeSum } from "@/lib/actions/income.actions";
import { getAllExpense, getExpenseSum } from "@/lib/actions/expense.actions";
import { getAccountSum, getUserAccount } from "@/lib/actions/account.actions";
import { HiArrowDown, HiArrowUp, HiOutlineWallet } from "react-icons/hi2";
import { getAccountCategory } from "@/lib/actions/category.actions";
import HighestSpendingSelect from "@/components/action/HighestSpendingSelect";
import { UserProvider } from "@/lib/context/UserContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

async function DashboardPage() {
  const session: any = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [
    accountSum,
    incomeSum,
    expenseSum,
    allExpenses,
    allIncomes,
    allAcc,
    userCategory,
  ] = await Promise.all([
    getAccountSum(userId),
    getIncomeSum(userId),
    getExpenseSum(userId),
    getAllExpense(userId),
    getAllIncome(userId),
    getUserAccount(userId),
    getAccountCategory(userId),
  ]);

  const tableData = [...allExpenses, ...allIncomes];

  const overview = [
    {
      title: "Total Balance",
      amount: accountSum,
      icon: <HiOutlineWallet size={24} />,
      color: "0, 176, 255",
    },
    {
      title: "Total Income",
      amount: incomeSum,
      icon: <HiArrowUp size={24} />,
      color: "80, 221, 179",
    },
    {
      title: "Total Expense",
      amount: expenseSum,
      icon: <HiArrowDown size={24} />,
      color: "239, 68, 68",
    },
  ];

  return (
    <section className="mb-4 px-4 md:mb-6 md:px-0">
      <div className="space-y-2">
        <div className="hidden space-y-4 md:block">
          <h3 className="text-base font-bold md:text-lg">Quick Actions</h3>
          <QuickActions />
        </div>
        <h3 className="text-base font-bold md:text-lg">Overview</h3>
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:grid-rows-5">
          {overview.map((data) => (
            <div key={data.title} className="h-fit">
              <OverviewCard
                title={data.title}
                icon={data.icon}
                amount={data.amount}
                color={data.color}
              />
            </div>
          ))}

          {/* Recent Activity */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:row-span-4 xl:-mt-[45px]">
            <div className="h-full w-full rounded-md border-2 p-4 dark:bg-accent/60 md:col-span-2">
              <h3 className="border-b-2  pb-2 text-base font-bold dark:border-foreground/20 md:text-lg">
                Recent Activity
              </h3>
              <UserProvider accounts={allAcc} categories={userCategory}>
                <DataTable columns={columns} data={tableData} />
              </UserProvider>
            </div>
          </div>

          {/* Accounts Chart Card */}
          <div className="space-y-4 rounded-md border-2 p-4 shadow-md dark:bg-accent/60 lg:col-span-2 xl:col-start-4 xl:row-span-3 xl:row-start-1">
            <div className="flex items-center justify-between border-b-2 pb-3 dark:border-foreground/20">
              <h3 className="text-base font-bold md:text-lg">Accounts</h3>
              <Link
                href={"/account"}
                className="flex items-center font-semibold duration-300 hover:text-main-cyan"
              >
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="lg:h-[450px]">
              <DonutChart accountData={allAcc} />
            </div>
          </div>

          {/* Highest Spending Card */}
          <div className="w-full space-y-4 rounded-md border-2 p-4 shadow-md dark:bg-accent/60 xl:col-span-2 xl:col-start-4 xl:row-span-2 xl:row-start-4">
            <div className="flex items-center justify-between border-b-2 pb-3 dark:border-foreground/20">
              <h3 className="text-base font-bold md:text-lg">
                Highest Spending
              </h3>
              <Link
                href={"/expense"}
                className="flex items-center font-semibold duration-300 hover:text-main-cyan"
              >
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <HighestSpendingSelect />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
