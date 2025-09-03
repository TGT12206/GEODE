import { AmethystNumber } from "classes/amethyst-scripting/structs/number/number";
import { AmethystRuntimeFunction } from "../runtime-function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";

export class RuntimeNumberOperator extends AmethystRuntimeFunction {
    async Execute(): Promise<AmethystNumber> {
        const param1 = this.parameters[0];
        const param2 = <AmethystStruct> this.parameters[1];
        const param3 = this.parameters[2];

        const param1IsAFRI = param1 instanceof AmethystRuntimeFunction;
        const param3IsAFRI = param3 instanceof AmethystRuntimeFunction;

        const num1 = param1IsAFRI ? (await param1.Execute()).value : param1.value;
        const num2 = param3IsAFRI ? (await param3.Execute()).value : param3.value;

        const output = AmethystStructHandler.Create('number', 0, 'output');
        switch(param2.value) {
            case '+':
            default:
                output.value = num1 + num2;
                break;
            case '-':
                output.value = num1 - num2;
                break;
            case '*':
                output.value = num1 * num2;
                break;
            case '÷':
                output.value = num1 / num2;
                break;
        }

        return output;
    }
}
