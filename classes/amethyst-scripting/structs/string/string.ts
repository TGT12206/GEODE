import { AmethystStruct } from "../struct";

/**
 * A string variable in the Amethyst scripting language
 */
export class AmethystString extends AmethystStruct {
    type = 'string';
    value: string;
    constructor(value = '', name = '') {
        super(value, name);
    }
}