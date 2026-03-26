import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { loginRequestSchema } from "@workforce/shared";

const apiBaseUrl =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = loginRequestSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        try {
          const response = await fetch(`${apiBaseUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(parsedCredentials.data)
          });

          if (!response.ok) {
            return null;
          }

          const payload = (await response.json()) as {
            token: string;
            user: {
              id: number;
              email: string;
              role: "employee" | "manager" | "admin";
            };
          };

          return {
            ...payload.user,
            token: payload.token
          };
        } catch (_error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.email = user.email;
        token.role = user.role;
        token.token = user.token;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id ?? 0,
        email: token.email ?? "",
        role: token.role ?? "employee",
        token: token.token ?? ""
      };

      return session;
    }
  }
};
