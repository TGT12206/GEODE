import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystFunction } from "../function";
import { AmethystFunctionHandler } from "../function-handler";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";

export class IfElse extends AmethystFunction {
    type = 'if else';
    constructor(parameters: (AmethystStruct | AmethystFunction)[] | undefined) {
        super()
        const condition = AmethystStructHandler.Create('boolean', false, 'condition');
        const doNothing = AmethystFunctionHandler.Create('none');
        this.defaultParameters = [condition, doNothing, doNothing];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AmethystStructHandler.Copy(condition));
            this.parameters.push(AmethystFunctionHandler.Copy(doNothing));
            this.parameters.push(AmethystFunctionHandler.Copy(doNothing));
        }
    }
}