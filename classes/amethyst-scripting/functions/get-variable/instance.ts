import { AmethystStruct, varType } from "classes/amethyst-scripting/structs/struct";
import { AmethystFunction } from "../function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { Project } from "classes/project";
import { GEODEObjectHandler } from "classes/geode-objects/geode-object-handler";

export class GetVariable extends AmethystFunction {
    type: 'get variable' = 'get variable';
    parameters: AmethystStruct[];
    override GetReturnType(project: Project): varType {
        const varName = <AmethystStruct> this.parameters[0];
        const objIndex = <AmethystStruct> this.parameters[1];
        const obj = project.sceneView.objects[objIndex.value];
        const varToGet = GEODEObjectHandler.GetVariable(obj, varName.value);
        return varToGet.type;
    }
    constructor(parameters: AmethystStruct[] | undefined) {
        super()
        const varName = AmethystStructHandler.Create('number', 'Sprite Path', 'Variable Name');
        const objIndex = AmethystStructHandler.Create('number', 0, 'Object Index');
        this.defaultParameters = [varName, objIndex];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AmethystStructHandler.Copy(varName));
            this.parameters.push(AmethystStructHandler.Copy(objIndex));
        }
    }
}