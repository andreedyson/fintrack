import {
  HiSquares2X2,
  HiCreditCard,
  HiArrowUp,
  HiArrowDown,
  HiBanknotes,
  HiArrowsRightLeft,
} from "react-icons/hi2";

export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const SidebarLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <HiSquares2X2 size={20} />,
  },
  {
    title: "Account",
    path: "/account",
    icon: <HiCreditCard size={20} />,
  },
  {
    title: "Income",
    path: "/income",
    icon: <HiArrowUp size={20} />,
  },
  {
    title: "Expense",
    path: "/expense",
    icon: <HiArrowDown size={20} />,
  },
  {
    title: "Transfer",
    path: "/transfer",
    icon: <HiArrowsRightLeft size={20} />,
  },
  {
    title: "Category",
    path: "/category",
    icon: <HiBanknotes size={20} />,
  },
];

export type AccountType = {
  _id: string;
  name: string;
  user: string;
  balance: number;
  color: string;
  income: TransactionType[];
  expense: TransactionType[];
};

export type TransactionType = {
  _id: string;
  name: string;
  date: string;
  amount: number;
  user: string;
  account: string;
  total?: number;
  type?: string;
};

export type TransactionHighest = {
  _id: string;
  type: string;
  name: string;
  date: string;
  amount: number;
};

export type CategoryType = {
  _id: string;
  name: string;
  budget: number;
};

export type CategoryExpenses = {
  _id: string;
  name: string;
  budget: number;
  totalExpenses: number;
};

export type TransferType = {
  _id: string;
  name: string;
  date: Date;
  amount: number;
  user: string;
  type: string;
  from: string;
  to: string;
  fromId: string;
  toId: string;
  fromColor: string;
  toColor: string;
};

export const currencyFormatter = (amount: number) => {
  const formatter = Intl.NumberFormat("id-ID", {
    currency: "IDR",
    style: "currency",
  });

  return formatter.format(amount);
};
