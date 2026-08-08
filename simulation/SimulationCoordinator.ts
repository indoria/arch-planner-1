import { Architecture } from '../store/architecture';
import { ScriptRuntime } from './ScriptRuntime';
import { SimulationEngine, NodeTelemetry, SimulationOptions } from './SimulationEngine';

export class SimulationCoordinator {
  constructor(
    private architecture: Architecture,
    private runtime: ScriptRuntime
  ) {}

  /**
   * Runs multiple simulations in parallel.
   * @param numRuns The number of parallel simulations to run.
   * @param options Optional callbacks for telemetry (will be shared across runs).
   * @returns An array of results for each simulation run.
   */
  async runParallel(numRuns: number, options: SimulationOptions = {}): Promise<Record<string, NodeTelemetry>[]> {
    const runs = Array.from({ length: numRuns }, () => {
      const engine = new SimulationEngine(this.architecture, this.runtime, options);
      return engine.run();
    });

    return Promise.all(runs);
  }
}
