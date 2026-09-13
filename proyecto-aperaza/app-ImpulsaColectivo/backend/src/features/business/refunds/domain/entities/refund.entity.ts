import { TransactionStatus } from '../../../../../common/enums/transaction-status.enum';

export interface RefundProps {
  id?: number;
  referenceId: number;
  date: Date;
  reason: string;
  total: number;
  status?: TransactionStatus;
}

export class Refund {
  id?: number;
  referenceId: number;
  date: Date;
  reason: string;
  total: number;
  status: TransactionStatus;

  private constructor(props: RefundProps) {
    this.id = props.id;
    this.referenceId = props.referenceId;
    this.date = props.date;
    this.reason = props.reason;
    this.total = props.total;
    this.status = props.status ?? TransactionStatus.PENDIENTE;
  }

  static create(props: Omit<RefundProps, 'id' | 'status'>): Refund {
    if (!props.referenceId) {
      throw new Error('La referencia de la devolución es requerida');
    }

    if (!props.reason?.trim()) {
      throw new Error('El motivo de la devolución es requerido');
    }

    if (!props.total || props.total <= 0) {
      throw new Error('El total de la devolución debe ser mayor a 0');
    }

    return new Refund(props);
  }

  static reconstitute(props: RefundProps): Refund {
    return new Refund(props);
  }

  update(props: Partial<Omit<RefundProps, 'id'>>): void {
    if (props.total !== undefined) {
      if (props.total <= 0) {
        throw new Error('El total de la devolución debe ser mayor a 0');
      }
      this.total = props.total;
    }

    if (props.date !== undefined) {
      this.date = props.date;
    }

    if (props.reason !== undefined) {
      if (!props.reason.trim()) {
        throw new Error('El motivo de la devolución es requerido');
      }
      this.reason = props.reason;
    }

    if (props.status !== undefined) {
      this.status = props.status;
    }
  }

  approve(): void {
    this.status = TransactionStatus.COMPLETADO;
  }

  reject(): void {
    this.status = TransactionStatus.CANCELADO;
  }
}
