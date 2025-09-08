import { AmethystRuntimeFunction } from "../runtime-function";

/**
 * This function type does nothing, and can be used to represent an empty slot
 * for parameters that must be functions.
 */
export class RuntimeDoNothing extends AmethystRuntimeFunction {
    async Execute(): Promise<void> { }
}