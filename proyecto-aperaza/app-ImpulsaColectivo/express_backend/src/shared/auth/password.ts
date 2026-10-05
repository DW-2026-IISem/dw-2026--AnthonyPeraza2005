import { hash, compare } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";

/**
 * Hash y verificación de contraseñas (bcrypt) y utilidades para tokens.
 *
 * Se centraliza aquí porque lo usan varios sitios y deben usar los mismos
 * parámetros: el hook del modelo `User`, el service de usuarios y el login.
 *
 * Coste 12 rondas: compromiso entre CPU del servidor y costo de fuerza bruta
 * para quien obtuviera un hash.
 */
const SALT_ROUNDS = 12;

/** Devuelve el hash bcrypt de una contraseña en claro. */
export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, SALT_ROUNDS);
}

/** `true` si la contraseña en claro corresponde al hash almacenado. */
export async function comparePassword(plain: string, passwordHash: string): Promise<boolean> {
  return compare(plain, passwordHash);
}

/**
 * Hash determinista (SHA-256, hex) para credenciales de ALTA entropía.
 * Se usa con los refresh tokens, no con contraseñas: un token aleatorio de
 * 64 bytes no es adivinable, así que basta con que no quede en claro en la BD.
 * Permite buscar por índice único (`token_hash`).
 */
export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Genera un token opaco no adivinable (URL-safe, 64 bytes ≈ 86 caracteres). */
export function generateOpaqueToken(): string {
  return randomBytes(64).toString("base64url");
}
