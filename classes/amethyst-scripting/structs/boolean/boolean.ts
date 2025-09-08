import { AmethystStruct } from "../struct";

/**
 * A boolean variable in the Amethyst scripting language
 */
export class AmethystBoolean extends AmethystStruct {
    type: 'boolean' = 'boolean';
    value: boolean;
    constructor(value: boolean | undefined = undefined, name = '') {
        value = value === undefined ? false : value;
        super(value, name);
    }
}