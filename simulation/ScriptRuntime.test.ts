import { ScriptRuntime } from './ScriptRuntime';

describe('ScriptRuntime', () => {
  let runtime: ScriptRuntime;

  beforeEach(() => {
    runtime = new ScriptRuntime();
  });

  it('should execute a simple script and return the result', async () => {
    const script = 'return 1 + 1;';
    const result = await runtime.execute(script);
    expect(result).toBe(2);
  });

  it('should support input variables in the script', async () => {
    const script = 'return input.x + input.y;';
    const context = { x: 10, y: 20 };
    const result = await runtime.execute(script, context);
    expect(result).toBe(30);
  });

  it('should handle errors in the script gracefully', async () => {
    const script = 'throw new Error("test error");';
    await expect(runtime.execute(script)).rejects.toThrow('test error');
  });

  it('should prevent access to dangerous globals', async () => {
    const script = 'return typeof process;';
    const result = await runtime.execute(script);
    expect(result).toBe('undefined');
  });

  it('should support node parameters in the script', async () => {
    const script = 'return parameters.latencyRange.max > input.latency;';
    const context = { latency: 50 };
    const parameters = { latencyRange: { min: 0, max: 100 } };
    const result = await runtime.execute(script, context, parameters);
    expect(result).toBe(true);
  });
});
