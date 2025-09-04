import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBoolean } from "classes/amethyst-scripting/structs/boolean/boolean";
import { AmethystRuntimeFunction } from "../../runtime-function";
import { GEODEView } from "classes/geode-view";

export class RuntimeBooleanBinaryOperator extends AmethystRuntimeFunction {
    async Execute(view: GEODEView): Promise<AmethystBoolean> {
        const param1 = this.parameters[0];
        const param2 = <AmethystStruct> this.parameters[1];
        const param3 = this.parameters[2];

        const param1IsAFRI = param1 instanceof AmethystRuntimeFunction;
        const param3IsAFRI = param3 instanceof AmethystRuntimeFunction;

        const bool1 = param1IsAFRI ? (await param1.Execute(view)).value : param1.value;
        const bool2 = param3IsAFRI ? (await param3.Execute(view)).value : param3.value;

        const output = AmethystStructHandler.Create('boolean', false, 'output');
        switch(param2.value) {
            case 'or':
            default:
                output.value = bool1 || bool2;
                break;
            case 'and':
                output.value = bool1 && bool2;
                break;
        }

        return output;
    }
}
