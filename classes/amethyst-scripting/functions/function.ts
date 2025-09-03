import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";

/**
 * A function in the Amethyst scripting language.
 */
export abstract class AmethystFunction {
    /**
     * All of the Amethyst block types provided by the plugin.
     */
    static knownTypes = [
        'none',
        'chain',
        'get variable',
        'set variable',
        'if',
        'if else',
        'compare values',
        'key down',
        'number operator'
    ];

    /**
     * The type of the function (must be one of the values in AmethystFunction.knownTypes).
     */
    type: string;

    /**
     * The default values for parameters of this function type.
     * This should not be edited outside of the constructor of a subclass,
     * and should only be changed by said subclass.
     */
    defaultParameters: (AmethystStruct | AmethystFunction)[];

    /**
     * The parameters of this function type, in the form of variables or functions.
     * Functions placed into parameter slots could be used purely as functions to execute,
     * such as the function in an if statement, or used for their returned value. This is
     * up to the specific subclass to handle.
     */
    parameters: (AmethystStruct | AmethystFunction)[];

    constructor() {
        this.defaultParameters = [];
        this.parameters = [];
    }
}