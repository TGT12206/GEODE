import { AmethystStruct } from "../struct";

/**
 * A boolean variable in the Amethyst scripting language
 */
export class AmethystBoolean extends AmethystStruct {
    type = 'boolean';
    value: boolean;
    constructor(value = false, name = '') {
        super(value, name);
    }
}