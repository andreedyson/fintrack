import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EditIncomeForm from "./EditIncomeForm";
import EditExpenseForm from "./EditExpenseForm";
import EditTransferForm from "./EditTransferForm";
import { useContext } from "react";
import UserContext from "@/lib/context/UserContext";

type Props = {
  activity: any;
  onSubmitSuccess: () => void;
};

function EditTransactionDialog({ activity, onSubmitSuccess }: Props) {
  const { mappedCategories: categories } = useContext(UserContext);

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Edit {activity.type.toLowerCase()} details</DialogTitle>
        <DialogDescription>
          Edit your {activity.type} transaction details.
        </DialogDescription>
      </DialogHeader>
      <div>
        {activity.type === "Income" && (
          <EditIncomeForm
            activity={activity}
            onSubmitSuccess={onSubmitSuccess}
          />
        )}
        {activity.type === "Expense" && (
          <EditExpenseForm
            activity={activity}
            categories={categories}
            onSubmitSuccess={onSubmitSuccess}
          />
        )}
        {activity.type === "Transfer" && (
          <EditTransferForm
            activity={activity}
            onSubmitSuccess={onSubmitSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default EditTransactionDialog;
