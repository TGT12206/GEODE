import { AmethystRuntimeFunction } from "../runtime-function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBoolean } from "classes/amethyst-scripting/structs/boolean/boolean";

export class RuntimeBooleanOperator extends AmethystRuntimeFunction {
    async Execute(): Promise<AmethystBoolean> {
        const param1 = this.parameters[0];
        const param2 = <AmethystStruct> this.parameters[1];
        const param3 = this.parameters[2];

        const param1IsAFRI = param1 instanceof AmethystRuntimeFunction;
        const param3IsAFRI = param3 instanceof AmethystRuntimeFunction;

        const bool1 = param1IsAFRI ? (await param1.Execute()).value : param1.value;
        const bool2 = param3IsAFRI ? (await param3.Execute()).value : param3.value;

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
