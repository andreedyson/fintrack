import { currencyFormatter } from "@/index";

type Props = {
  transactionData: any;
};

function HighestSpendingList({ transactionData }: Props) {
  const formattedAmount = currencyFormatter(transactionData.amount);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b-2 pb-2">
        <div>
          <p>{transactionData.name}</p>
          <p>{transactionData.date}</p>
        </div>
        <div>
          <p className="font-bold text-red-500">{formattedAmount}</p>
        </div>
      </div>
    </div>
  );
}

export default HighestSpendingList;
