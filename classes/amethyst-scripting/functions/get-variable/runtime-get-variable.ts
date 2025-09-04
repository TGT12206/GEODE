import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystRuntimeFunction } from "../runtime-function";
import { GEODEObjectHandler } from "classes/geode-objects/geode-object-handler";

export class RuntimeGetVariable extends AmethystRuntimeFunction {
    parameters: AmethystStruct[];
    async Execute(): Promise<AmethystStruct> {
        const varName = this.parameters[0];
        const objIndex = this.parameters[1];
        const obj = this.project.gameView.objects[objIndex.value];
        return GEODEObjectHandler.GetVariable(obj, varName.value);
    }
}
