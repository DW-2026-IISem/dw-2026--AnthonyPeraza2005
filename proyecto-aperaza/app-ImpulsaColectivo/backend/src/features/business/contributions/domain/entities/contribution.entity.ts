export interface ContributionProps {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  projectId: number;
  contributorId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Contribution {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  projectId: number;
  contributorId: number;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ContributionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.projectId = props.projectId;
    this.contributorId = props.contributorId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<ContributionProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Contribution {
    if (!props.name?.trim()) {
      throw new Error('El nombre del aporte es requerido');
    }

    return new Contribution(props);
  }

  static reconstitute(props: ContributionProps): Contribution {
    return new Contribution(props);
  }

  update(props: Partial<Omit<ContributionProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del aporte es requerido');
      }
      this.name = props.name;
    }

    if (props.description !== undefined) {
      this.description = props.description;
    }

    if (props.projectId !== undefined) {
      this.projectId = props.projectId;
    }

    if (props.contributorId !== undefined) {
      this.contributorId = props.contributorId;
    }
  }

  deactivate(): void {
    this.isActive = false;
  }
}
