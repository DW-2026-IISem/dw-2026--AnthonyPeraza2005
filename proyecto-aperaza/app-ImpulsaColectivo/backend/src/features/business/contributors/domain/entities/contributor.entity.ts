export interface ContributorProps {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Contributor {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ContributorProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<ContributorProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Contributor {
    if (!props.name?.trim()) {
      throw new Error('El nombre del aportante es requerido');
    }

    return new Contributor(props);
  }

  static reconstitute(props: ContributorProps): Contributor {
    return new Contributor(props);
  }

  update(props: Partial<Omit<ContributorProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del aportante es requerido');
      }
      this.name = props.name;
    }

    if (props.description !== undefined) {
      this.description = props.description;
    }
  }

  deactivate(): void {
    this.isActive = false;
  }
}
