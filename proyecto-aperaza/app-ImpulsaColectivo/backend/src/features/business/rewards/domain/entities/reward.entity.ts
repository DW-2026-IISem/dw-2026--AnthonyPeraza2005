export interface RewardProps {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  projectId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Reward {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  projectId: number;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: RewardProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.projectId = props.projectId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<RewardProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Reward {
    if (!props.name?.trim()) {
      throw new Error('El nombre de la recompensa es requerido');
    }

    return new Reward(props);
  }

  static reconstitute(props: RewardProps): Reward {
    return new Reward(props);
  }

  update(props: Partial<Omit<RewardProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la recompensa es requerido');
      }
      this.name = props.name;
    }

    if (props.description !== undefined) {
      this.description = props.description;
    }

    if (props.projectId !== undefined) {
      this.projectId = props.projectId;
    }
  }

  deactivate(): void {
    this.isActive = false;
  }
}
