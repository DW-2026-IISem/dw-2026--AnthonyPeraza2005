import { TransactionStatus } from '../../../../../common/enums/transaction-status.enum';

export interface CommissionProps {
  id?: number;
  referenceId: number;
  date: Date;
  amount: number;
  status?: TransactionStatus;
  notes?: string;
}

export class Commission {
  id?: number;
  referenceId: number;
  date: Date;
  amount: number;
  status: TransactionStatus;
  notes?: string;

  private constructor(props: CommissionProps) {
    this.id = props.id;
    this.referenceId = props.referenceId;
    this.date = props.date;
    this.amount = props.amount;
    this.status = props.status ?? TransactionStatus.PENDIENTE;
    this.notes = props.notes;
  }

  static create(props: Omit<CommissionProps, 'id' | 'status'>): Commission {
    if (!props.referenceId) {
      throw new Error('La referencia de la comisión es requerida');
    }

    if (!props.amount || props.amount <= 0) {
      throw new Error('El monto de la comisión debe ser mayor a 0');
    }

    return new Commission(props);
  }

  static reconstitute(props: CommissionProps): Commission {
    return new Commission(props);
  }

  update(props: Partial<Omit<CommissionProps, 'id'>>): void {
    if (props.amount !== undefined) {
      if (props.amount <= 0) {
        throw new Error('El monto de la comisión debe ser mayor a 0');
      }
      this.amount = props.amount;
    }

    if (props.date !== undefined) {
      this.date = props.date;
    }

    if (props.status !== undefined) {
      this.status = props.status;
    }

    if (props.notes !== undefined) {
      this.notes = props.notes;
    }
  }

  complete(): void {
    this.status = TransactionStatus.COMPLETADO;
  }

  cancel(): void {
    this.status = TransactionStatus.CANCELADO;
  }
}
