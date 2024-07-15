import { connectToDB } from "@/lib/database";
import User from "@/lib/models/user.model";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  await connectToDB();

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    if (name.trim().length < 4) {
      return NextResponse.json(
        {
          message: "Name should be at least 4 characters",
        },
        { status: 400 },
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        {
          message: "Invalid Email",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password should be at least 8 characters",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return NextResponse.json({ message: "User Registered" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
