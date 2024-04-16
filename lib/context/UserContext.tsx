"use client";

import { AccountType, CategoryType } from "@/index";
import { createContext } from "react";

interface ContextValueType {
  mappedAccounts: AccountType[];
  mappedCategories?: CategoryType[];
}

const UserContext = createContext<ContextValueType>(
  [] as unknown as ContextValueType,
);

type Props = {
  children: React.ReactNode;
  accounts: AccountType[];
  categories?: CategoryType[];
};

export const UserProvider = ({ children, accounts, categories }: Props) => {
  const contextValue: ContextValueType = {
    mappedAccounts: accounts,
    mappedCategories: categories,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContext;
