import { AmethystBoolean } from "classes/amethyst-scripting/structs/boolean/boolean";
import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { GEODEView } from "classes/geode-view";
import { AmethystRuntimeFunction } from "../../runtime-function";

export class RuntimeCompareOrdinals extends AmethystRuntimeFunction {
    async Execute(view: GEODEView): Promise<AmethystBoolean> {
        const param1 = this.parameters[0];
        const param2 = <AmethystStruct> this.parameters[1];
        const param3 = this.parameters[2];

        const param1IsAFRI = param1 instanceof AmethystRuntimeFunction;
        const param3IsAFRI = param3 instanceof AmethystRuntimeFunction;

        const val1 = param1IsAFRI ? (await param1.Execute(view)).value : param1.value;
        const val2 = param3IsAFRI ? (await param3.Execute(view)).value : param3.value;

        const output = AmethystStructHandler.Create('boolean', false, 'output');
        switch(param2.value) {
            case '=':
            default:
                output.value = val1 === val2;
                break;
            case '!=':
                output.value = val1 !== val2;
                break;
            case '<':
                output.value = val1 < val2;
                break;
            case '<=':
                output.value = val1 <= val2;
                break;
            case '>':
                output.value = val1 > val2;
                break;
            case '>=':
                output.value = val1 >= val2;
                break;
        }

        return <AmethystBoolean> output;
    }
}
