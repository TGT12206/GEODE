import { AmethystStruct } from "../struct";

/**
 * A number variable in the Amethyst scripting language
 */
export class AmethystNumber extends AmethystStruct {
    type = 'number';
    value: number;
    constructor(value = 0, name = '') {
        super(value, name);
    }
}