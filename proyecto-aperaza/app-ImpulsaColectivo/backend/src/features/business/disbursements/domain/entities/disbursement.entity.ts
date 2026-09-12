export interface DisbursementProps {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  projectId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Disbursement {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  projectId: number;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: DisbursementProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.projectId = props.projectId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<DisbursementProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Disbursement {
    if (!props.name?.trim()) {
      throw new Error('El nombre del desembolso es requerido');
    }

    return new Disbursement(props);
  }

  static reconstitute(props: DisbursementProps): Disbursement {
    return new Disbursement(props);
  }

  update(props: Partial<Omit<DisbursementProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del desembolso es requerido');
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
