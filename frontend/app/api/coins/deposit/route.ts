import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { CoinService, CC_EXCHANGE_RATE } from "@/app/lib/coinService";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const authHeader = (await headers()).get("authorization");
    const userId = authHeader?.split(" ")[1];

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amountUSDC, referenceId, note } = await req.json();

    if (!amountUSDC || amountUSDC <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const amountCC = amountUSDC * CC_EXCHANGE_RATE;

    const balanceAfter = await CoinService.deposit("USER", userId, amountCC, referenceId, note);

    return NextResponse.json({ success: true, balanceAfter, amountCC });
  } catch (error: any) {
    console.error("Deposit API Error:", error);
    return NextResponse.json(
      { error: "Failed to process deposit", details: error.message },
      { status: 500 }
    );
  }
}
