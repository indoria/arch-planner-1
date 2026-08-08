export class ScriptRuntime {
  /**
   * Executes a JavaScript script in a restricted environment.
   * @param script The JS script to execute.
   * @param input The input data for the script.
   * @param parameters The node parameters (latency, range, etc.)
   * @returns The result of the script execution.
   */
  async execute(script: string, input: any = {}, parameters: any = {}): Promise<any> {
    try {
      // Create a restricted context
      const context = {
        input,
        parameters,
        console: {
          log: (...args: any[]) => { /* Optional: capture logs */ },
          error: (...args: any[]) => { /* Optional: capture errors */ },
        },
        // Add other safe globals if needed
      };

      // Wrap the script in a function that provides the context variables as arguments
      // and masks dangerous globals by providing them as undefined.
      const maskedGlobals = ['process', 'window', 'document', 'localStorage', 'sessionStorage', 'fetch', 'XMLHttpRequest'];
      const argNames = [...Object.keys(context), ...maskedGlobals];
      const argValues = [...Object.values(context), ...maskedGlobals.map(() => undefined)];

      const fn = new Function(...argNames, script);
      
      // Execute the function with the provided context
      return fn(...argValues);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(String(error));
    }
  }
}
