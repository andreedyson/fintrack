import { CategoryExpenses, currencyFormatter } from "@/index";
import EditCategoryDialog from "../form/EditCategoryDialog";

type Props = {
  category: CategoryExpenses;
};

function CategoryCard({ category }: Props) {
  const formatTotalExpenses = currencyFormatter(category.totalExpenses);
  const formatBudget = currencyFormatter(category.budget);

  return (
    <div className="flex items-center gap-4 rounded-md border px-4 py-8 shadow-md dark:bg-accent">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">{category.name}</h3>
          <EditCategoryDialog category={category} />
        </div>
        <p className="text-xl font-bold">
          <span className="text-red-500">{formatTotalExpenses} </span> /{" "}
          <span className="text-green-500">{formatBudget}</span>
        </p>
      </div>
    </div>
  );
}

export default CategoryCard;
