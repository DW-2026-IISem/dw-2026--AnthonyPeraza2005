export interface ProjectAuditProps {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  projectId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProjectAudit {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  projectId: number;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ProjectAuditProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.projectId = props.projectId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<ProjectAuditProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): ProjectAudit {
    if (!props.name?.trim()) {
      throw new Error('El nombre de la auditoría de proyecto es requerido');
    }

    return new ProjectAudit(props);
  }

  static reconstitute(props: ProjectAuditProps): ProjectAudit {
    return new ProjectAudit(props);
  }

  update(props: Partial<Omit<ProjectAuditProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la auditoría de proyecto es requerido');
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
