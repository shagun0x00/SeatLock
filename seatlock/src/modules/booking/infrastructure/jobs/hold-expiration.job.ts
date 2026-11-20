
import { ExpireHoldsUseCase } from "../../application/use-cases/expire-holds.usecase";
import type { ExpireHoldsResult } from "../../application/use-cases/expire-holds.usecase";

export type HoldExpirationJobOutcome =
  | {
      status: "COMPLETED";
      result: ExpireHoldsResult;
    }
  | {
      status: "SKIPPED";
      reason: "ALREADY_RUNNING";
    };

export class HoldExpirationJob {
  private isRunning = false;

  constructor(
    private readonly expireHoldsUseCase: ExpireHoldsUseCase,
  ) {}

  async run(): Promise<HoldExpirationJobOutcome> {
    // Prevent overlapping executions in this application instance.
    if (this.isRunning) {
      return {
        status: "SKIPPED",
        reason: "ALREADY_RUNNING",
      };
    }

    this.isRunning = true;

    try {
      const result = await this.expireHoldsUseCase.execute();

      return {
        status: "COMPLETED",
        result,
      };
    } finally {
      // Always release the execution lock, including on failure.
      this.isRunning = false;
    }
  }
}
