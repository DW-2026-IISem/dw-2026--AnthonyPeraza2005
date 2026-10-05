import { User, UserI } from "../user.model";

/**
 * Respuesta HTTP de un usuario.
 *
 * `password` NUNCA sale de la API. El repository ni siquiera lo proyecta en las
 * lecturas, y además el mapper lo elimina por si el modelo se cargó con el hash.
 */
export type UserResponseDto = Omit<UserI, "password">;

/** Mapper modelo -> DTO de respuesta (objeto plano; elimina `password`). */
export function toUserResponse(user: User): UserResponseDto {
  const { password, ...safe } = user.toJSON() as UserI & { password?: string };
  return safe;
}
