import { AmethystStruct, varType } from "classes/amethyst-scripting/structs/struct";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { AmethystFunction } from "../../function";

export class BooleanUnaryOperator extends AmethystFunction {
    type: 'boolean unary operator' = 'boolean unary operator';
    override GetReturnType(): varType {
        return 'boolean';
    }
    constructor(parameters: (AmethystStruct | AmethystFunction)[] | undefined) {
        super()
        const bool = AmethystStructHandler.Create('boolean', false, 'bool');
        this.defaultParameters = [bool];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AmethystStructHandler.Copy(bool));
        }
    }
}
