import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystFunction } from "../function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { AmethystFunctionHandler } from "../function-handler";

export class If extends AmethystFunction {
    type = 'if';
    constructor(parameters: (AmethystStruct | AmethystFunction)[] | undefined) {
        super()
        const condition = AmethystStructHandler.Create('boolean', false, 'Condition');
        const doNothing = AmethystFunctionHandler.Create('none');
        this.defaultParameters = [condition, doNothing];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AmethystStructHandler.Copy(condition));
            this.parameters.push(AmethystFunctionHandler.Copy(doNothing));
        }
    }
}