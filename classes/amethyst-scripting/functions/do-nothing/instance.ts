import { varType } from "classes/amethyst-scripting/structs/struct";
import { AmethystFunction } from "../function";

/**
 * This function type does nothing, and can be used to represent an empty slot
 * for parameters that must be functions.
 */
export class DoNothing extends AmethystFunction {
    type: 'none' = 'none';
    override GetReturnType(): varType {
        return 'none';
    }
}