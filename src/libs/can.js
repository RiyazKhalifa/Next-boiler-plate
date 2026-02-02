"use client";

import { useSession } from "next-auth/react";

export default function Can({ permission, children }) {
    const { data: session } = useSession();
    const hasPermission = session?.user?.permissions?.includes(permission);

    if (!hasPermission) return null;
    return <>{children}</>;
}
