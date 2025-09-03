import { AmethystStruct } from "../struct";

/**
 * A number variable in the Amethyst scripting language
 */
export class AmethystNumber extends AmethystStruct {
    type = 'number';
    value: number;
    constructor(value: number | undefined = undefined, name = '') {
        value = value === undefined ? 0 : value;
        super(value, name);
    }
}