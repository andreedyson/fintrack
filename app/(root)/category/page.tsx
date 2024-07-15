import { getServerSession } from "next-auth";

import CategoryCard from "@/components/card/CategoryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
  getCategoryAccount,
  getUserAccount,
} from "@/lib/actions/account.actions";
import AddCategoryBtn from "@/components/action/AddCategoryBtn";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./category-columns";
import {
  getAccountCategory,
  getCategoryLinechart,
  getExpenseBycategory,
} from "@/lib/actions/category.actions";
import { UserProvider } from "@/lib/context/UserContext";
import CategoryLineChart from "@/components/chart/CategoryLineChart";
import Image from "next/image";

async function CategoryPage() {
  const session: any = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [
    userAccount,
    userCategory,
    allCategories,
    categoryExpenses,
    lineChartData,
  ] = await Promise.all([
    getUserAccount(userId),
    getAccountCategory(userId),
    getCategoryAccount(userId),
    getExpenseBycategory(userId),
    getCategoryLinechart(userId),
  ]);

  return (
    <section className="mb-6 px-4 md:px-0">
      <div className="w-full space-y-6 md:mb-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-4">
          {/* Budget Category Cards */}
          <div className="h-full w-full space-y-4 rounded-md border-2 bg-background p-4 dark:bg-accent/60 lg:col-span-4 lg:row-span-4">
            <h3 className="border-b-2 pb-2 text-base font-bold md:text-lg">
              Budget Category
            </h3>
            <AddCategoryBtn />
            <div
              className={`grid gap-4 md:max-lg:grid-cols-2  ${allCategories.length === 0 && "place-items-center justify-center lg:h-[800px]"}`}
            >
              {allCategories.length ? (
                allCategories.map((card) => (
                  <div key={card._id}>
                    <CategoryCard category={card} />
                  </div>
                ))
              ) : (
                <div className="flex w-full flex-col items-center justify-center gap-6">
                  <Image
                    src={"/assets/no-category.svg"}
                    width={300}
                    height={500}
                    alt="No Data Linechart"
                  />
                  <p className="max-w-56 text-center text-lg font-semibold">
                    You haven&apos;t added any categories yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Category Activity Tables */}
          <div className="space-y-4 rounded-md border-2 bg-background p-4 dark:bg-accent/60 lg:col-span-full lg:col-start-5 lg:row-span-2">
            <h3 className="border-b-2 pb-2 text-base font-bold md:text-lg">
              Activity
            </h3>
            <div>
              <UserProvider accounts={userAccount} categories={userCategory}>
                <div>
                  <DataTable columns={columns} data={categoryExpenses} />
                </div>
              </UserProvider>
            </div>
          </div>
          <div className="space-y-4 rounded-md border-2 bg-background p-4 dark:bg-accent/60 lg:col-span-full lg:col-start-5 lg:row-span-2 lg:row-start-3">
            <h3 className="border-b-2 pb-2 text-base font-bold md:text-lg">
              Insights
            </h3>

            {/* Line Charts Insights */}
            <div className="w-full lg:h-[680px]">
              {lineChartData.length ? (
                <Tabs
                  className="w-full"
                  defaultValue={lineChartData[0].categoryId}
                >
                  <TabsList className="grid h-full w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                    {lineChartData.map((tab) => (
                      <TabsTrigger key={tab.categoryId} value={tab.categoryId}>
                        {tab.categoryName}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {lineChartData.map((data) => (
                    <div key={data.id} className="mt-12 h-full md:mt-24">
                      <TabsContent
                        value={data.categoryId}
                        className="h-[300px] lg:h-full"
                      >
                        <CategoryLineChart categoryData={data} />
                      </TabsContent>
                    </div>
                  ))}
                </Tabs>
              ) : (
                <div className="flex w-full flex-col items-center justify-center gap-6 md:h-full">
                  <Image
                    src={"/assets/insights-chart.svg"}
                    width={300}
                    height={500}
                    alt="No Data Linechart"
                  />
                  <p className="max-w-56 text-center text-lg font-semibold">
                    No transaction yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryPage;
