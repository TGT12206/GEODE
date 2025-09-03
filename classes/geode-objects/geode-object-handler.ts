import { AppAndProject } from "classes/project";
import { GEODEObjectEditor } from "./geode-object-editor";
import { GEODEObject } from "./geode-object";
import { GEODERuntimeObject } from "./geode-runtime-object";

export class GEODEObjectHandler {
    static GetVariable(obj: GEODEObject | GEODERuntimeObject, name: string) {
        for (let i = 0; i < obj.variables.length; i++) {
            if (obj.variables[i].name === name) {
                return obj.variables[i];
            }
        }
        throw new Error('Variable ' + name + ' not found on object ' + obj.idInScene + ': ' + obj.name);
    }
    static CreateEditor(obj: GEODEObject, anp: AppAndProject, inspectorDiv: HTMLDivElement): GEODEObjectEditor {
        return new GEODEObjectEditor(obj, anp, inspectorDiv);
    }
    static CreateRuntimeObject(obj: GEODEObject, anp: AppAndProject, objDiv: HTMLDivElement): GEODERuntimeObject {
        return new GEODERuntimeObject(obj, anp, objDiv);
    }
}