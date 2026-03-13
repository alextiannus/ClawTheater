import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_for_local_dev_only_12345";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("ct_auth_token")?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = verify(token, JWT_SECRET);
        } catch (err) {
            // Token expired or invalid
            const response = NextResponse.json({ authenticated: false }, { status: 401 });
            response.cookies.delete("ct_auth_token");
            return response;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            const response = NextResponse.json({ authenticated: false }, { status: 401 });
            response.cookies.delete("ct_auth_token");
            return response;
        }

        return NextResponse.json({
            authenticated: true,
            userId: user.id,
            email: user.email,
            displayName: user.displayName,
            walletAddress: user.walletAddress,
            usdcBalance: user.usdcBalance,
            userType: user.userType
        }, { status: 200 });

    } catch (error) {
        console.error("Auth /me Error:", error);
        return NextResponse.json({ authenticated: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // Used to explicitly delete the cookie for logout
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.delete("ct_auth_token");
    return response;
}
