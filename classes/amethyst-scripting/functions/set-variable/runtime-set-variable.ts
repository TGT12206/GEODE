import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystRuntimeFunction } from "../runtime-function";
import { GEODEObjectHandler } from "classes/geode-objects/geode-object-handler";
import { GEODEView } from "classes/geode-view";

export class RuntimeSetVariable extends AmethystRuntimeFunction {
    async Execute(view: GEODEView): Promise<void> {
        const varName = <AmethystStruct> this.parameters[0];
        const objIndex = <AmethystStruct> this.parameters[1];
        const val = this.parameters[2];
        const obj = this.project.gameView.objects[objIndex.value];
        const varToSet = GEODEObjectHandler.GetVariable(obj, varName.value);
        varToSet.value = val instanceof AmethystRuntimeFunction ? (await val.Execute(view)).value : val.value;
    }
}
