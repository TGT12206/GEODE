import { GEODEObjectEditor } from "./geode-object-editor";
import { GEODEObject } from "./geode-object";
import { GEODERuntimeObject } from "./geode-runtime-object";
import { Project } from "classes/project";
import { GEODEView } from "classes/geode-view";

export class GEODEObjectHandler {
    static GetVariable(obj: GEODEObject | GEODERuntimeObject, name: string) {
        for (let i = 0; i < obj.variables.length; i++) {
            if (obj.variables[i].name === name) {
                return obj.variables[i];
            }
        }
        throw new Error('Variable ' + name + ' not found on object ' + obj.idInScene + ': ' + obj.name);
    }
    static CreateEditor(obj: GEODEObject, view: GEODEView, project: Project, inspectorDiv: HTMLDivElement): GEODEObjectEditor {
        return new GEODEObjectEditor(obj, view, project, inspectorDiv);
    }
    static CreateRuntimeObject(obj: GEODEObject, project: Project, objDiv: HTMLDivElement): GEODERuntimeObject {
        return new GEODERuntimeObject(obj, project, objDiv);
    }
}