import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_for_local_dev_only_12345";

export async function verifyAdmin(req: NextRequest) {
  try {
    // 1. Check for API Key (MCP / Bot Access)
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const apiKey = authHeader.split(" ")[1];
      const validAdminKeys = (process.env.ADMIN_API_KEYS || "").split(",").map(k => k.trim()).filter(Boolean);
      
      if (validAdminKeys.length > 0 && validAdminKeys.includes(apiKey)) {
        return { isAdmin: true, status: 200 };
      }
      // If header is provided but invalid, immediately reject
      return { isAdmin: false, error: "Invalid Admin API Key provided", status: 401 };
    }

    // 2. Check for UI Cookies (Human Web Access)
    const token = req.cookies.get("ct_auth_token")?.value;

    if (!token) {
      return { isAdmin: false, error: "No authentication token provided", status: 401 };
    }

    let decoded: any;
    try {
      decoded = verify(token, JWT_SECRET);
    } catch (err) {
      return { isAdmin: false, error: "Invalid or expired token", status: 401 };
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    });

    if (!user || !user.email) {
      return { isAdmin: false, error: "User not found or no email associated", status: 401 };
    }

    const adminEmailsConfig = process.env.ADMIN_EMAILS || "";
    // We split by comma and trim to support format: ADMIN_EMAILS="alice@example.com, bob@example.com"
    const adminEmails = adminEmailsConfig.split(",").map(e => e.trim().toLowerCase());
    
    // For development, if ADMIN_EMAILS is blank, we can either allow none or all. 
    // Secure by default: if not configured, nobody is an admin.
    if (!adminEmails.includes(user.email.toLowerCase())) {
        return { isAdmin: false, error: "Forbidden: Admin privileges required", status: 403 };
    }

    return { isAdmin: true, user, status: 200 };
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return { isAdmin: false, error: "Internal server error", status: 500 };
  }
}
