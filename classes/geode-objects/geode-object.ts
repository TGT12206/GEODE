import { AmethystFunction } from "classes/amethyst-scripting/functions/function";
import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";

export class GEODEObject {
    idInScene: number;
    name: string;
    onStart: AmethystFunction[];
    onNewFrame: AmethystFunction[];
    variables: AmethystStruct[];
    constructor(id: number) {
        this.idInScene = id;
        this.name = 'object';
        this.variables = [];
        this.onStart = [];
        this.onNewFrame = [];
        this.SetInitialVariableValues();
    }
    private SetInitialVariableValues() {
        this.variables.push(AmethystStructHandler.Create('string', '', 'Sprite Path'));
        this.variables.push(AmethystStructHandler.Create('number', 100, 'Sprite Width'));
        this.variables.push(AmethystStructHandler.Create('number', 100, 'Sprite Height'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'x'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'y'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'z'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'Velocity x'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'Velocity y'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'Velocity z'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'Acceleration x'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'Acceleration y'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'Acceleration z'));
        this.variables.push(AmethystStructHandler.Create('boolean', false, 'Do Rectangular Hitbox'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'Hitbox Radius/Half Width'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'Hitbox Half Height'));
        this.variables.push(AmethystStructHandler.Create('number', 0, 'Hitbox Half Thickness'));
    }
}