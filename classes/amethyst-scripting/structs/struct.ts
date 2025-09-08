/**
 * If adding a variable type, make sure to add to both the known types and type.
 * The known types is used by blocks to switch the type of value inputs
 * when a new function is dragged in.
 * 
 * For example, consider this pseudo code (the parentheses are parameters):
 * 
 * (get variable ('hp') from (object 0)) + (1)
 * 
 * if the user decides to switch to the variable 'thing to say',the block
 * automatically changes the value (1) to the default string, ('')
 * 
 * (get variable ('thing to say') from (object 0)) + ('')
 */

/**
 * If adding a variable type, make sure to add to StructHandler as well.
 */

export const knownVarTypes = [
    'none',
    'boolean',
    'number',
    'string'
] as const;

export type varType = typeof knownVarTypes[number];

/**
 * A variable in the Amethyst scripting language.
 */
export abstract class AmethystStruct {
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

    type: varType;
    
    /**
     * The value stored by this variable
     */
    value: any;

    /**
     * The name of the variable
     */
    name: string;

    /**
     * 
     * @param value 
     * @param name 
     */
    constructor(value: any, name = '') {
        this.name = name;
        this.value = value;
    }
}