import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystFunction } from "../function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";

export class GetVariable extends AmethystFunction {
    type = 'get variable';
    parameters: AmethystStruct[];
    constructor(parameters: AmethystStruct[] | undefined) {
        super()
        const varName = AmethystStructHandler.Create('number', 'Sprite Path', 'Variable Name');
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