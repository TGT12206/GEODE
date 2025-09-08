import { AmethystStruct, varType } from "classes/amethyst-scripting/structs/struct";
import { AmethystFunction } from "../function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { Project } from "classes/project";
import { GEODEObjectHandler } from "classes/geode-objects/geode-object-handler";

export class SetVariable extends AmethystFunction {
    type: 'set variable' = 'set variable';
    override GetReturnType(project: Project): varType {
        const varName = <AmethystStruct> this.parameters[0];
        const objIndex = <AmethystStruct> this.parameters[1];
        const obj = project.sceneView.objects[objIndex.value];
        const varToSet = GEODEObjectHandler.GetVariable(obj, varName.value);
        return varToSet.type;
    }
    constructor(parameters: (AmethystStruct | AmethystFunction)[] | undefined) {
        super();
        const varName = AmethystStructHandler.Create('string', 'Sprite Path', 'Variable Name');
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
