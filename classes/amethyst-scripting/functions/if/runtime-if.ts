import { AmethystRuntimeFunction } from "../runtime-function";

export class RuntimeIf extends AmethystRuntimeFunction {
    async Execute(): Promise<void> {
        const param1 = this.parameters[0];

        const param1IsAFRI = param1 instanceof AmethystRuntimeFunction;

        const condition = param1IsAFRI ? (await param1.Execute()).value : param1.value;

        if (condition) {
            const param2 = <AmethystRuntimeFunction> this.parameters[1];
            await param2.Execute();
        }
    }
}
