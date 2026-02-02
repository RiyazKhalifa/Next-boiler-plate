import CredentialProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

async function refreshAccessToken(token) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
                "refresh-token": token.refreshToken,
            },
        });

        const data = await res.json();

        if (!res.ok || !data?.data?.accessToken) {
            throw new Error(data.message || "Failed to refresh access token");
        }

        return {
            ...token,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken ?? token.refreshToken,
            accessTokenExpires: data.data.accessTokenExpiresIn,
            refreshTokenExpires: data.data.refreshTokenExpiresIn,
        };
    } catch (err) {
        console.error("Refresh token error:", err);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions = {
    providers: [
        CredentialProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(credentials),
                        }
                    );

                    const data = await res.json();

                    if (!res.ok || !data?.status) {
                        throw new Error(data.message || "Invalid credentials");
                    }

                    const decoded = jwt.decode(data.data.accessToken);

                    return {
                        id: decoded?.id,
                        name: decoded?.name,
                        email: decoded?.email,
                        profile_image: decoded?.profile_image,
                        status: decoded?.status,
                        role_id: decoded?.role_id,
                        role_name: decoded?.role_name,
                        permissions: decoded?.permissions ?? [],
                        accessToken: data.data.accessToken,
                        refreshToken: data.data.refreshToken,
                        accessTokenExpires: data.data.accessTokenExpiresIn,
                        refreshTokenExpires: data.data.refreshTokenExpiresIn,
                    };
                } catch (err) {
                    throw new Error(err.message);
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    pages: {
        signIn: "/login",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profile_image: user.profile_image,
                    status: user.status,
                    role_id: user.role_id,
                    role_name: user.role_name,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: user.accessTokenExpires,
                    refreshTokenExpires: user.refreshTokenExpires,
                    permissions: user.permissions ?? [],
                };
            }

            // If refresh token expired → force logout
            if (Date.now() > token.refreshTokenExpires) {
                return { ...token, error: "RefreshTokenExpired" };
            }

            // If access token still valid → return token
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            // Access token expired → refresh
            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                name: token.name,
                email: token.email,
                profile_image: token.profile_image,
                status: token.status,
                role_id: token.role_id,
                role_name: token.role_name,
                permissions: token.permissions ?? [],
            };
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.error = token.error;

            return session;
        },
    },
};
