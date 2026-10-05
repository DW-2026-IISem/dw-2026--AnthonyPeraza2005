import {
  ChangePasswordDto,
  CreateUserDto,
  PatchUserDto,
  UpdateUserDto,
  UserResponseDto,
  toUserResponse,
} from "./dto";
import { UsersRepository } from "./users.repository";
import { AppError } from "../../../shared/errors/app-error";
import { comparePassword } from "../../../shared/auth/password";

const MIN_PASSWORD_LENGTH = 8;

/**
 * Capa Service del feature Users.
 *
 * Reglas de negocio: unicidad de `username`/`email`, default de `status`,
 * política de borrado lógico y cambio de credencial. No conoce `req`/`res` ni
 * escribe Sequelize directamente.
 */
export class UsersService {
  public constructor(
    private readonly repository: UsersRepository = new UsersRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<UserResponseDto[]> {
    const users = await this.repository.findAllActive();
    return users.map((user) => toUserResponse(user));
  }

  public async getOne(id: number): Promise<UserResponseDto> {
    return toUserResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateUserDto): Promise<UserResponseDto> {
    if (!body.username || !body.email || !body.password) {
      throw new AppError(400, "username, email and password are required");
    }
    if (body.password.length < MIN_PASSWORD_LENGTH) {
      throw new AppError(400, `password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }
    await this.assertUnique(body.username, body.email);

    // Copia campo a campo: solo lo que declara el DTO llega al modelo
    // (evita mass assignment). El hook del modelo hashea `password`.
    const user = await this.repository.create({
      username: body.username,
      email: body.email,
      password: body.password,
      avatar: body.avatar ?? null,
      status: body.status ?? "active",
    });
    return toUserResponse(user);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateUserDto): Promise<UserResponseDto> {
    if (!body.username || !body.email) {
      throw new AppError(400, "username and email are required");
    }
    const user = await this.findOrFail(id);
    await this.assertUnique(body.username, body.email, id);

    await this.repository.update(user, {
      username: body.username,
      email: body.email,
      avatar: body.avatar ?? null,
    });
    return toUserResponse(user);
  }

  public async updatePatch(id: number, body: PatchUserDto): Promise<UserResponseDto> {
    const user = await this.findOrFail(id);

    const username = body.username ?? user.username;
    const email = body.email ?? user.email;
    await this.assertUnique(username, email, id);

    // Solo los campos permitidos: ni `password` ni `status` entran por aquí.
    const data: Record<string, unknown> = {};
    if (body.username !== undefined) data.username = body.username;
    if (body.email !== undefined) data.email = body.email;
    if (body.avatar !== undefined) data.avatar = body.avatar;

    await this.repository.update(user, data);
    return toUserResponse(user);
  }

  /**
   * Cambia la contraseña. Verifica la actual antes de aceptar la nueva; el hash
   * lo recalcula el hook `beforeUpdate` del modelo.
   */
  public async changePassword(id: number, body: ChangePasswordDto): Promise<void> {
    if (!body.current_password || !body.new_password) {
      throw new AppError(400, "current_password and new_password are required");
    }
    if (body.new_password.length < MIN_PASSWORD_LENGTH) {
      throw new AppError(400, `new_password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    const user = await this.repository.findByIdWithPassword(id);
    if (!user || user.status !== "active") {
      throw new AppError(404, "User not found");
    }

    const matches = await comparePassword(body.current_password, user.password);
    if (!matches) {
      throw new AppError(400, "Current password is incorrect");
    }

    await this.repository.update(user, { password: body.new_password });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const user = await this.findOrFail(id, false);
    await this.repository.delete(user);
  }

  /** Eliminación lógica -> `status = inactive` (no borra el hash). */
  public async deleteLogical(id: number): Promise<UserResponseDto> {
    const user = await this.findOrFail(id);
    await this.repository.update(user, { status: "inactive" });
    return toUserResponse(user);
  }

  // ================== HELPERS ==================
  /** Busca por PK y falla con 404. `onlyActive` aplica la política de borrado lógico. */
  private async findOrFail(id: number, onlyActive = true) {
    const user = await this.repository.findById(id);
    if (!user || (onlyActive && user.status !== "active")) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  /**
   * Comprueba que `username` y `email` no estén tomados por OTRO usuario.
   * `excludeId` excluye al propio usuario en las actualizaciones. Responde 409
   * con un mensaje útil en lugar de dejar que la restricción única reviente en 500.
   */
  private async assertUnique(
    username: string,
    email: string,
    excludeId?: number
  ): Promise<void> {
    const conflicts = await this.repository.findConflicts(username, email);
    const taken = conflicts.find((candidate) => candidate.id !== excludeId);

    if (!taken) return;
    if (taken.username === username.trim().toLowerCase()) {
      throw new AppError(409, "Username already in use");
    }
    throw new AppError(409, "Email already in use");
  }
}
