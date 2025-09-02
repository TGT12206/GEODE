/**
 * A variable in the Amethyst scripting language.
 */
export abstract class AmethystStruct {
    /**
     * All of the Amethyst variable types provided by the plugin
     */
    static knownTypes = [
        'none',
        'boolean',
        'number',
        'string'
    ]

    /**
     * The type of the variable (must be one of the values in AmethystStruct.knownTypes)
     */
    type: string;
    
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