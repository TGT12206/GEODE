import { AmethystStruct, varType } from "classes/amethyst-scripting/structs/struct";
import { AmethystFunction } from "../../function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";

export class NumberUnaryOperator extends AmethystFunction {
    type: 'number unary operator' = 'number unary operator';
    override GetReturnType(): varType {
        return 'number';
    }
    constructor(parameters: (AmethystStruct | AmethystFunction)[] | undefined) {
        super()
        const operator = AmethystStructHandler.Create('string', 'abs', 'operator');
        const num = AmethystStructHandler.Create('number', 0, 'num');
        this.defaultParameters = [operator, num];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AmethystStructHandler.Copy(operator));
            this.parameters.push(AmethystStructHandler.Copy(num));
        }
    }
}
