import { DataTable } from "@/components/ui/data-table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { columns } from "./columns";
import { getAllTransfer } from "@/lib/actions/transfer.actions";
import AddTransferBtn from "@/components/action/AddTransferBtn";
import { getUserAccount } from "@/lib/actions/account.actions";
import { UserProvider } from "@/lib/context/UserContext";

async function TransferPage() {
  const session: any = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [userAccount, allTransfers] = await Promise.all([
    getUserAccount(userId),
    getAllTransfer(userId),
  ]);

  return (
    <section className="mb-6 px-4 md:px-0">
      <div className="h-full w-full space-y-4 rounded-md border-2 bg-background p-4 dark:bg-accent/60 md:mb-6">
        <h3 className="border-b-2 pb-2 text-base font-bold md:text-lg ">
          Transfer History
        </h3>
        <AddTransferBtn accounts={userAccount} />
        <div>
          <UserProvider accounts={userAccount}>
            <DataTable columns={columns} data={allTransfers} />
          </UserProvider>
        </div>
      </div>
    </section>
  );
}

export default TransferPage;
