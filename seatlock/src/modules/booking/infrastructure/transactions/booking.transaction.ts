
import type {
  TransactionManager,
} from "../../application/use-cases/hold-seats.usecase";

/**
 * A transaction executor supplied by the infrastructure layer.
 *
 * A database adapter can later implement this function using
 * its own transaction mechanism.
 */
export type BookingTransactionRunner = <T>(
  operation: () => Promise<T>,
) => Promise<T>;

/**
 * Booking transaction adapter.
 *
 * Delegates transaction execution to the injected runner.
 * It does not simulate database transactions itself.
 */
export class BookingTransaction implements TransactionManager {
  constructor(
    private readonly transactionRunner: BookingTransactionRunner,
  ) {}

  run<T>(operation: () => Promise<T>): Promise<T> {
    return this.transactionRunner(operation);
  }
}
