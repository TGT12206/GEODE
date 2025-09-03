import { AmethystRuntimeFunction } from "../runtime-function";

export class RuntimeIfElse extends AmethystRuntimeFunction {
    async Execute(): Promise<void> {
        const param1 = this.parameters[0];

        const param1IsAmethystRuntimeFunction = param1 instanceof AmethystRuntimeFunction;

        const condition = param1IsAmethystRuntimeFunction ? (await param1.Execute()).value : param1.value;

        if (condition) {
            const param2 = <AmethystRuntimeFunction> this.parameters[1];
            await param2.Execute();
        } else {
            const param3 = <AmethystRuntimeFunction> this.parameters[2];
            await param3.Execute();
        }
    }
}
