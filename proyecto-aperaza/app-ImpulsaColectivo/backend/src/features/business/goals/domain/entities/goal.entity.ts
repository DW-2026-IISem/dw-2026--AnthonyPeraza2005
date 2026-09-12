export interface GoalProps {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  projectId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Goal {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  projectId: number;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: GoalProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.projectId = props.projectId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<GoalProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Goal {
    if (!props.name?.trim()) {
      throw new Error('El nombre de la meta es requerido');
    }

    return new Goal(props);
  }

  static reconstitute(props: GoalProps): Goal {
    return new Goal(props);
  }

  update(props: Partial<Omit<GoalProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la meta es requerido');
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
