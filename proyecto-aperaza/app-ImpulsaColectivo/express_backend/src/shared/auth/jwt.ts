import jwt, { JwtPayload } from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { AppError } from "../errors/app-error";

/**
 * Emisión y verificación del access token (JWT firmado, HS256).
 *
 * Buenas prácticas aplicadas (RFC 7519, RFC 8725, RFC 6750):
 *  - el algoritmo se fija en el código, nunca se toma del header `alg` del token;
 *  - se validan emisor (`iss`) y audiencia (`aud`);
 *  - el token viaja en `Authorization: Bearer <token>`.
 *
 * El access token no se persiste: se valida con la firma. Los roles NO viajan
 * en el token; la autorización se consulta en cada petición.
 */
const ALGORITHM = "HS256";

/** Emisor/audiencia del sistema: permiten rechazar tokens de otro servicio. */
export const TOKEN_ISSUER = "app-impulsacolectivo-express";
export const TOKEN_AUDIENCE = "app-impulsacolectivo-api";

/** Vida útil del access token (corta por diseño). */
export const ACCESS_TOKEN_TTL_SECONDS = Number(process.env.JWT_ACCESS_TTL ?? 900); // 15 min

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  username: string;
  jti: string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new AppError(500, "JWT_SECRET no configurado (mínimo 32 caracteres). Ver .env");
  }
  return secret;
}

/** Firma un access token para un usuario. */
export function signAccessToken(user: { id: number; username: string }): {
  token: string;
  expiresIn: number;
} {
  const token = jwt.sign({ username: user.username }, getSecret(), {
    algorithm: ALGORITHM,
    subject: String(user.id),
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    jwtid: randomUUID(),
  });
  return { token, expiresIn: ACCESS_TOKEN_TTL_SECONDS };
}

/**
 * Verifica firma y claims y devuelve el payload. Cualquier fallo se traduce a
 * `AppError(401)` para que el middleware responda "no autenticado".
 *
 * `jsonwebtoken` no tiene la opción `require` (es de `jose`), por eso `sub` y
 * `jti` se comprueban a mano: `sub` debe ser un entero positivo y `jti` no vacío.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, getSecret(), {
      algorithms: [ALGORITHM],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
      clockTolerance: 5,
    }) as JwtPayload;
  } catch {
    throw new AppError(401, "Invalid or expired access token");
  }

  if (
    typeof payload.sub !== "string" ||
    !/^[1-9]\d*$/.test(payload.sub) ||
    typeof payload.jti !== "string" ||
    payload.jti.length === 0
  ) {
    throw new AppError(401, "Invalid or expired access token");
  }

  return payload as AccessTokenPayload;
}

/** Extrae el token de `Authorization: Bearer <token>` (RFC 6750). */
export function extractBearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const [scheme, value] = header.split(" ");
  if (!scheme || !value || scheme.toLowerCase() !== "bearer") return null;
  return value;
}
