import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystFunction } from "../../function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";

export class NumberBinaryOperator extends AmethystFunction {
    type = 'number binary operator';
    constructor(parameters: (AmethystStruct | AmethystFunction)[] | undefined) {
        super()
        const num1 = AmethystStructHandler.Create('number', 0, 'num1');
        const operator = AmethystStructHandler.Create('string', '+', 'operator');
        const num2 = AmethystStructHandler.Create('number', 0, 'num2');
        this.defaultParameters = [num1, operator, num2];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AmethystStructHandler.Copy(num1));
            this.parameters.push(AmethystStructHandler.Copy(operator));
            this.parameters.push(AmethystStructHandler.Copy(num2));
        }
    }
}
