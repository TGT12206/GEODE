import { AmethystNumber } from "classes/amethyst-scripting/structs/number/number";
import { AmethystRuntimeFunction } from "../../runtime-function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { GEODEView } from "classes/geode-view";

export class RuntimeNumberUnaryOperator extends AmethystRuntimeFunction {
    async Execute(view: GEODEView): Promise<AmethystNumber> {
        const param1 = <AmethystStruct> this.parameters[0];
        const param2 = this.parameters[1];

        const param2IsAFRI = param2 instanceof AmethystRuntimeFunction;

        const num = param2IsAFRI ? (await param2.Execute(view)).value : param2.value;

        const output = AmethystStructHandler.Create('number', 0, 'output');
        switch(param1.value) {
            case 'abs':
            default:
                output.value = Math.abs(num);
                break;
            case 'sin':
                output.value = Math.sin(RuntimeNumberUnaryOperator.DegToRad(num));
                break;
            case 'cos':
                output.value = Math.cos(RuntimeNumberUnaryOperator.DegToRad(num));
                break;
        }

        return <AmethystNumber> output;
    }
    private static DegToRad(deg: number): number {
        return deg * Math.PI / 180;
    }
}
