import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Account, User as AuthUser } from "next-auth";
import bcrypt from "bcrypt";

import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/database";
import { NextResponse } from "next/server";

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await connectToDB();
        try {
          if (!credentials.email.includes("@")) {
            return NextResponse.json(
              { message: "Email is not valid" },
              { status: 400 },
            );
          }

          if (!credentials.password || credentials.password.length < 8) {
            return NextResponse.json(
              {
                message: "Password should be atleast 8 characters",
              },
              { status: 400 },
            );
          }

          const user = await User.findOne({ email: credentials.email }).select(
            "+password",
          );
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password,
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (account?.provider === "google") {
        await connectToDB();
        try {
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              name: user.name,
              image: user.image,
            });

            await newUser.save();
          }
          return true;
        } catch (error: any) {
          console.log("Error saving user", error);
          return false;
        }
      }
    },
    async redirect({ baseUrl }: { baseUrl: string }) {
      return `${baseUrl}/`;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session) {
        await connectToDB();

        const userData = await User.findOne({ email: session.user.email });

        if (userData) {
          return {
            ...session,
            user: { ...session.user, id: userData._id.toString() },
          };
        }
      }

      if (token?.rememberMe) {
        session.expires = new Date(Date.now() + 60 * 60 * 24 * 30 + 1000);
      }
    },
  },
  pages: {
    signIn: "/",
  },
};
