import { AmethystBoolean } from "./boolean/boolean";
import { AmethystBooleanEditor } from "./boolean/boolean-editor";
import { AmethystNumber } from "./number/number";
import { AmethystNumberEditor } from "./number/number-editor";
import { AmethystString } from "./string/string";
import { AmethystStringEditor } from "./string/string-editor";
import { AmethystStruct } from "./struct";
import { AmethystStructEditor } from "./struct-editor";

/**
 * Used to handle Amethyst structs generically.
 * This includes creating them, copying them, and creating HTML Input for them.
 */
export class AmethystStructHandler {
    /**
     * Creates an instance (variable) of a given Amethyst struct type, gives it the name, and sets the value
     * @param type The type of struct to create (check AmethystStruct.knownTypes if you don't know the supported types)
     * @param value The value to initialize the variable with.
     * @param name The name of the variable (optional).
     * @returns The new variable.
     */
    static Create(type: string, value: any, name = ''): AmethystStruct {
        switch(type) {
            case 'none':
            case 'boolean':
            default:
                return new AmethystBoolean(value, name);
            case 'number':
                return new AmethystNumber(value, name);
            case 'string':
                return new AmethystString(value, name);
        }
    }
    
    /**
     * Creates a shallow copy of the Amethyst variable provided.
     * The new copy will have the name 'Copy of {original name}'.
     * @param obj The variable to copy.
     * @returns The copied variable.
     */
    static Copy(obj: AmethystStruct): AmethystStruct {
        let newObj;
        switch(obj.type) {
            case 'none':
            case 'boolean':
            default:
                return newObj = new AmethystBoolean(obj.value, 'Copy of ' + obj.name);
            case 'number':
                return newObj = new AmethystNumber(obj.value, 'Copy of ' + obj.name);
            case 'string':
                return new AmethystString(obj.value, 'Copy of ' + obj.name);
        }
    }

    /**
     * Creates an editor in HTML for the given variable.
     * @param variable The variable to create an editor for.
     * @param editorDiv The div allocated for the editor.
     * @returns The editor of the variable
     */
    static CreateEditor(variable: AmethystStruct, editorDiv: HTMLDivElement): AmethystStructEditor {
        switch(variable.type) {
            case 'none':
            case 'boolean':
            default:
                return new AmethystBooleanEditor(variable, editorDiv);
            case 'number':
                return new AmethystNumberEditor(variable, editorDiv);
            case 'string':
                return new AmethystStringEditor(variable, editorDiv);
        }
    }
}