import { GEODEView } from "classes/geode-view";
import { AmethystBoolean } from "./boolean/boolean";
import { AmethystBooleanEditor } from "./boolean/boolean-editor";
import { AmethystNumber } from "./number/number";
import { AmethystNumberEditor } from "./number/number-editor";
import { AmethystString } from "./string/string";
import { AmethystStringEditor } from "./string/string-editor";
import { AmethystStruct, varType } from "./struct";
import { AmethystStructEditor } from "./struct-editor";

/**
 * If adding a variable type, make sure to add it to AmethystStruct's type and knownTypes as well
 */

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
    static Create(type: varType, value: any = undefined, name = ''): AmethystStruct {
        switch(type) {
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
     * The new copy will have the same name as the original.
     * @param obj The variable to copy.
     * @returns The copied variable.
     */
    static Copy(obj: AmethystStruct): AmethystStruct {
        let newObj;
        switch(obj.type) {
            case 'boolean':
            default:
                return newObj = new AmethystBoolean(obj.value, obj.name);
            case 'number':
                return newObj = new AmethystNumber(obj.value, obj.name);
            case 'string':
                return new AmethystString(obj.value, obj.name);
        }
    }

    /**
     * Creates an editor in HTML for the given variable.
     * @param variable The variable to create an editor for.
     * @param editorDiv The div allocated for the editor.
     * @returns The editor of the variable
     */
    static CreateEditor(variable: AmethystStruct, editorDiv: HTMLDivElement, view: GEODEView): AmethystStructEditor {
        switch(variable.type) {
            case 'boolean':
            default:
                return new AmethystBooleanEditor(<AmethystBoolean> variable, editorDiv, view);
            case 'number':
                return new AmethystNumberEditor(<AmethystNumber> variable, editorDiv, view);
            case 'string':
                return new AmethystStringEditor(<AmethystString> variable, editorDiv, view);
        }
    }
}