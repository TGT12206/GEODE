import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBoolean } from "classes/amethyst-scripting/structs/boolean/boolean";
import { AmethystRuntimeFunction } from "../../runtime-function";
import { GEODEView } from "classes/geode-view";

export class RuntimeBooleanUnaryOperator extends AmethystRuntimeFunction {
    async Execute(view: GEODEView): Promise<AmethystBoolean> {
        const param1 = <AmethystStruct> this.parameters[0];
        const param2 = this.parameters[1];

        const param2IsAFRI = param2 instanceof AmethystRuntimeFunction;

        const bool = param2IsAFRI ? (await param2.Execute(view)).value : param2.value;

        const output = AmethystStructHandler.Create('boolean', false, 'output');
        switch(param1.value) {
            case 'not':
            default:
                output.value = !bool;
                break;
        }

        return <AmethystBoolean> output;
    }
}
