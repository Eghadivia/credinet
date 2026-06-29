import { decodeJwt } from "@/components/global/jwt-decode/jwt-decode";
import Cookies from "js-cookie";

type TokenPayload = {
  sub: string;
  email?: string;
  full_name?: string;
};

export function getLoggedInUser() {
  const token = Cookies.get("token");
  if (!token) return null;

  const decoded = decodeJwt<TokenPayload>(token);
  if (!decoded) {
    console.error("Failed to decode token");
    return null;
  }

  return decoded;
}
