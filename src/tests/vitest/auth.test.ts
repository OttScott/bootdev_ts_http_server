import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "../../auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "AnotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
      hash1 = await hashPassword(password1);
      hash2 = await hashPassword(password2);
  });

    it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

    it("should return false for the wrong password", async () => {
    const result = await checkPasswordHash(password2, hash1);
    expect(result).toBe(false);
  });
});
// JWT Tests
describe("JWT Handling", () => {
  const secret = "mySecretKey";
    it("should return Exception for invalid token", () => {    
    const token = makeJWT("user123", 60, secret);
    expect(() => validateJWT(token, "wrongSecretKey")).toThrow("Invalid token");
  });

    it("should return Exception for expired token", () => {
    const token = makeJWT("user123", 1, secret); // Token that in 1 second expires
    // Wait for 2 seconds to ensure the token is expired
    setTimeout(() => {
      expect(() => validateJWT(token, secret)).toThrow("Token has expired");
    }, 2000);
  });

    it("should return userId for valid token", () => {
    const token = makeJWT("user123", 60, secret);
    const userId = validateJWT(token, secret);
    expect(userId).toBe("user123");
  });
});