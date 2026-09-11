export interface PromoterProps {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Promoter {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: PromoterProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<PromoterProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Promoter {
    if (!props.name?.trim()) {
      throw new Error('El nombre del promotor es requerido');
    }

    return new Promoter(props);
  }

  static reconstitute(props: PromoterProps): Promoter {
    return new Promoter(props);
  }

  update(
    props: Partial
      Omit<PromoterProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del promotor es requerido');
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
