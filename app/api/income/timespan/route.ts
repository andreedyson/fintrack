import { NextResponse } from "next/server";
import { getIncomeByTimespan } from "@/lib/actions/income.actions";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("span");
  const userId = url.searchParams.get("userId");

  if (!query || !userId) {
    return NextResponse.json(
      { error: "Parameter is required" },
      { status: 400 },
    );
  }

  const res = await getIncomeByTimespan(userId, query);

  return NextResponse.json(res);
}
