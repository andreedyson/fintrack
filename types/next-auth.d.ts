import { DefaultSession } from "next-auth";

declare module "next-auth" {
  type User = {
    name: string;
    email: string;
    image: string;
    id: string;
  };

  interface Session {
    user: User & DefaultSession["user"];
  }
}
