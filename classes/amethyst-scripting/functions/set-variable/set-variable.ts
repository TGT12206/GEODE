import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystFunction } from "../function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";

export class SetVariable extends AmethystFunction {
    type = 'set variable';
    constructor(parameters: (AmethystStruct | AmethystFunction)[] | undefined) {
        super();
        const varName = AmethystStructHandler.Create('string', 'Sprite Path', 'Variable Name');
        const objIndex = AmethystStructHandler.Create('number', 0, 'Object Index');
        this.defaultParameters = [varName, objIndex];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AmethystStructHandler.Copy(varName));
            this.parameters.push(AmethystStructHandler.Copy(objIndex));
        }
    }
}
