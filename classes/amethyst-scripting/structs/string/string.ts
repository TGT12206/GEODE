import { AmethystStruct } from "../struct";

/**
 * A string variable in the Amethyst scripting language
 */
export class AmethystString extends AmethystStruct {
    type = 'string';
    value: string;
    constructor(value: string | undefined = undefined, name = '') {
        value = value === undefined ? '' : value;
        super(value, name);
    }
}