import { varType } from "classes/amethyst-scripting/structs/struct";
import { DoNothing } from "../do-nothing/instance";
import { AmethystFunction } from "../function";
import { AmethystFunctionHandler } from "../function-handler";

export class Chain extends AmethystFunction {
    type: 'chain' = 'chain';
    override GetReturnType(): varType {
        return 'none';
    }
    defaultParameters: AmethystFunction[];
    parameters: AmethystFunction[];
    constructor(parameters: (AmethystFunction)[] | undefined = undefined) {
        super();
        const doNothing = new DoNothing();
        this.defaultParameters.push(doNothing);
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AmethystFunctionHandler.Copy(doNothing));
        }
    }
}
