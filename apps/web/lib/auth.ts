import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { loginRequestSchema } from "@workforce/shared";

const apiBaseUrl =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

function getApiBaseCandidates() {
  const candidates = [apiBaseUrl];

  if (apiBaseUrl.includes("localhost")) {
    candidates.push(apiBaseUrl.replace("localhost", "127.0.0.1"));
  }

  return [...new Set(candidates)];
}

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

        for (const baseUrl of getApiBaseCandidates()) {
          try {
            const response = await fetch(`${baseUrl}/auth/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(parsedCredentials.data)
            });

            if (!response.ok) {
              continue;
            }

          const payload = (await response.json()) as {
            token: string;
            user: {
              id: number;
              email: string;
              role: "employee" | "manager" | "admin";
              employeeId?: number | null;
              firstName?: string | null;
              lastName?: string | null;
            };
          };

            return {
              ...payload.user,
              token: payload.token
            };
          } catch (_error) {
            continue;
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.email = user.email;
        token.role = user.role;
        token.employeeId = user.employeeId;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.token = user.token;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id ?? 0,
        email: token.email ?? "",
        role: token.role ?? "employee",
        employeeId: token.employeeId ?? null,
        firstName: token.firstName ?? null,
        lastName: token.lastName ?? null,
        token: token.token ?? ""
      };

      return session;
    }
  }
};
