import jwt from "jsonwebtoken";
import cookie from "cookie";

/**
 * Authenticate a WebSocket connection using JWT stored in cookies
 * @param {IncomingMessage} req
 * @returns {Object} decoded JWT payload
 * @throws Error if authentication fails
 */
export function authenticateWS(req) {
  // Parse cookies from header
  const cookies = cookie.parse(req.headers.cookie || "");

  const token = cookies.jwt;

  if (!token) {
    throw new Error("Unauthorized: No token");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Unauthorized: Invalid token");
  }

  return decoded;
}