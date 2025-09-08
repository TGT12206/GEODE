import { AmethystStruct, varType } from "classes/amethyst-scripting/structs/struct";
import { Project } from "classes/project";

/**
 * If adding a function, make sure to add to both the known types and type.
 * The known types is used by the script editor to generate one of every type.
 */

/**
 * If adding a function type, make sure to add to FunctionHandler as well.
 */

export const knownFunctionTypes = [
    'none', // Used for an empty slot in blocks such as if blocks
    'chain',
    'get variable',
    'set variable',
    'if',
    'if else',
    'key down',
    'compare equality',
    'compare ordinals',
    'boolean binary operator',
    'number binary operator',
    'boolean unary operator',
    'number unary operator'
] as const;

export type functionType = typeof knownFunctionTypes[number];

/**
 * A function in the Amethyst scripting language.
 */
export abstract class AmethystFunction {
    /**
     * An enum for the types is not used because when saved to json,
     * they are saved as integers. This makes any projects that a user saves
     * break if a new type is added between existing types. At the same time,
     */
    
    /**
     * An enum for the types is not used because when saved to json,
     * they are saved as integers. This makes any projects that a user saves
     * break if a new type is added between existing types. At the same time,
     */

    /**
     * The type of the function (must be one of the values in AmethystFunction.knownTypes).
     */
    type: functionType;
    
    abstract GetReturnType(project: Project): varType;

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