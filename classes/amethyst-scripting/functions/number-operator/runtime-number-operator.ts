import { AmethystNumber } from "classes/amethyst-scripting/structs/number/number";
import { AmethystRuntimeFunction } from "../runtime-function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";

export class RuntimeNumberOperator extends AmethystRuntimeFunction {
    async Execute(): Promise<AmethystNumber> {
        const param1 = this.parameters[0];
        const param2 = this.parameters[1];

        const param1IsAFRI = param1 instanceof AmethystRuntimeFunction;
        const param2IsAFRI = param2 instanceof AmethystRuntimeFunction;

        const num1 = param1IsAFRI ? (await param1.Execute()).value : param1.value;
        const num2 = param2IsAFRI ? (await param2.Execute()).value : param2.value;

        const output = AmethystStructHandler.Create('number', 0, 'output');
        output.value = num1 + num2;

        return output;
    }
}
