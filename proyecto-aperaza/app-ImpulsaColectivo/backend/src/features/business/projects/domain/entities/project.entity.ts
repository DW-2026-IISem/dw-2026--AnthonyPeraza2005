export interface ProjectProps {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  promoterId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Project {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  promoterId: number;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ProjectProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.promoterId = props.promoterId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<ProjectProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Project {
    if (!props.name?.trim()) {
      throw new Error('El nombre del proyecto es requerido');
    }

    return new Project(props);
  }

  static reconstitute(props: ProjectProps): Project {
    return new Project(props);
  }

  update(props: Partial<Omit<ProjectProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del proyecto es requerido');
      }
      this.name = props.name;
    }

    if (props.description !== undefined) {
      this.description = props.description;
    }

    if (props.promoterId !== undefined) {
      this.promoterId = props.promoterId;
    }
  }

  deactivate(): void {
    this.isActive = false;
  }
}
