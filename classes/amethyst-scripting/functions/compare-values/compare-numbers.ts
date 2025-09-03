import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { AmethystFunction } from "../function";

export class CompareNumbers extends AmethystFunction {
    type = 'compare numbers';
    constructor(parameters: (AmethystStruct | AmethystFunction)[] | undefined) {
        super()
        const val1 = AmethystStructHandler.Create('number', 0, 'val1');
        const type = AmethystStructHandler.Create('string', '=', 'comparison type');
        const val2 = AmethystStructHandler.Create('number', 0, 'val2');
        this.defaultParameters = [val1, type, val2];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AmethystStructHandler.Copy(val1));
            this.parameters.push(AmethystStructHandler.Copy(type));
            this.parameters.push(AmethystStructHandler.Copy(val2));
        }
    }
}