import { NextResponse } from "next/server";
import { DEMO_TRANSACTIONS } from "@/app/lib/demo-data";

// GET /api/mcp/transactions — View transactions (UC 5.1)
// Note: No Transaction model in Prisma schema — aggregated from Tips/Fundings
export async function GET() {
    return NextResponse.json({ transactions: DEMO_TRANSACTIONS });
}
