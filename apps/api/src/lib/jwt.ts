import jwt from "jsonwebtoken";

const SECRET = process.env.API_JWT_SECRET ?? "dev-secret-change-me";

export type ApiTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: "ADMIN" | "SECRETARIAT";
};

export function signApiToken(payload: ApiTokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "12h" });
}

export function verifyApiToken(token: string): ApiTokenPayload {
  return jwt.verify(token, SECRET) as ApiTokenPayload;
}
