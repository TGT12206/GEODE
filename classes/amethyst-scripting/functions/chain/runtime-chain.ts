import { GEODEView } from "classes/geode-view";
import { AmethystRuntimeFunction } from "../runtime-function";

export class RuntimeChain extends AmethystRuntimeFunction {
    parameters: AmethystRuntimeFunction[];
    async Execute(view: GEODEView): Promise<void> {
        for (let i = 0; i < this.parameters.length; i++) {
            await this.parameters[i].Execute(view);
        }
    }
}
