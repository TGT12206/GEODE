import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystFunction } from "../function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";

export class BooleanOperator extends AmethystFunction {
    type = 'boolean operator';
    constructor(parameters: (AmethystStruct | AmethystFunction)[] | undefined) {
        super()
        const bool1 = AmethystStructHandler.Create('boolean', false, 'bool1');
        const operator = AmethystStructHandler.Create('string', 'or', 'operator');
        const bool2 = AmethystStructHandler.Create('boolean', false, 'bool2');
        this.defaultParameters = [bool1, operator, bool2];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AmethystStructHandler.Copy(bool1));
            this.parameters.push(AmethystStructHandler.Copy(operator));
            this.parameters.push(AmethystStructHandler.Copy(bool2));
        }
    }
}
