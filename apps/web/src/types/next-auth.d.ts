import type { DefaultSession } from "next-auth";

type AppRole = "ADMIN" | "SECRETARIAT";

declare module "next-auth" {
  interface User {
    role: AppRole;
    apiToken: string;
  }

  interface Session {
    user: DefaultSession["user"] & { role: AppRole };
    apiToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppRole;
    apiToken?: string;
  }
}
