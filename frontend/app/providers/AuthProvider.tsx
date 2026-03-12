"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { syncAuth } = useAuth();

    useEffect(() => {
        // Hydrate the JWT session immediately on app load
        syncAuth();
    }, [syncAuth]);

    return <>{children}</>;
}
