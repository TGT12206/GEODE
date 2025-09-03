import { AmethystFunction } from "../function";

/**
 * This function type does nothing, and can be used to represent an empty slot
 * for parameters that must be functions.
 */
export class DoNothing extends AmethystFunction {
    type = 'none';
}