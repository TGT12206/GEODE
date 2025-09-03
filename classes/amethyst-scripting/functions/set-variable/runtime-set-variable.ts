import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystRuntimeFunction } from "../runtime-function";
import { GEODEObjectHandler } from "classes/geode-objects/geode-object-handler";

export class RuntimeSetVariable extends AmethystRuntimeFunction {
    async Execute(): Promise<void> {
        const varName = <AmethystStruct> this.parameters[0];
        const objIndex = <AmethystStruct> this.parameters[1];
        const val = this.parameters[2];
        const obj = this.anp.project.gameView.objects[objIndex.value];
        const varToSet = GEODEObjectHandler.GetVariable(obj, varName.value);
        varToSet.value = val instanceof AmethystRuntimeFunction ? (await val.Execute()).value : val.value;
    }
}
