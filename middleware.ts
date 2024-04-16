export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/account",
    "/income",
    "/expense",
    "/transfer",
    "/saving",
    "/category",
  ],
};
