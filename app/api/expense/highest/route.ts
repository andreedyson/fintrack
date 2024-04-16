import { NextResponse } from "next/server";
import { getHighestSpending } from "@/lib/actions/expense.actions";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("span");
    const userId = url.searchParams.get("userId");

    if (!query || !userId) {
      return NextResponse.json(
        { error: "Parameter is required" },
        { status: 400 },
      );
    }

    const res = await getHighestSpending(userId, query);

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting highest spending expenses." },
      { status: 400 },
    );
  }
}
