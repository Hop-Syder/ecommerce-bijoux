import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type LoginResponse = {
  token: string;
  user: { id: string; email: string; name: string; role: "ADMIN" | "SECRETARIAT" };
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
        if (!res.ok) return null;
        const data: LoginResponse = await res.json();
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          apiToken: data.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.apiToken = user.apiToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as "ADMIN" | "SECRETARIAT";
      session.apiToken = token.apiToken as string;
      return session;
    },
  },
});
