import { AccountType, currencyFormatter } from "@/index";
import EditAccountDialog from "../form/EditAccountDialog";

type Props = {
  account: AccountType;
};

function AccountCard({ account }: Props) {
  const formattedAmount = currencyFormatter(account.balance);

  return (
    <div className="flex items-center gap-2 rounded-md border-2 p-4 px-4 py-6 shadow-md dark:bg-accent">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold" style={{ color: account.color }}>
            {account.name}
          </h2>
          <EditAccountDialog account={account} />
        </div>
        <p className="text-xl font-bold">{formattedAmount}</p>
      </div>
    </div>
  );
}

export default AccountCard;
