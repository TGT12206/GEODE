import { AFHandler, AFI, AFRI } from "classes/functions/function";
import { AppAndProject } from "classes/project";
import { Scope } from "classes/scope";
import { AS, ASHandler, ASI } from "classes/structs/struct";
import { ImageFile, VideoFile } from "./file-types/real-file";

export class GEOD3ObjectHandler {
    static GetVariable(obj: GEOD3Object | GEOD3ObjectRI, name: string) {
        for (let i = 0; i < obj.variables.length; i++) {
            if (obj.variables[i].name === name) {
                return obj.variables[i];
            }
        }
        throw new Error('Variable ' + name + ' not found on object ' + obj.idInScene + ': ' + obj.name);
    }
    static CreateII(obj: GEOD3Object, anp: AppAndProject, inspectorDiv: HTMLDivElement): GEOD3ObjectII {
        return new GEOD3ObjectII(obj, anp, inspectorDiv);
    }
    static CreateRI(obj: GEOD3Object, anp: AppAndProject, objDiv: HTMLDivElement): GEOD3ObjectRI {
        return new GEOD3ObjectRI(obj, anp, objDiv);
    }
}

export class GEOD3Object {
    idInScene: number;
    name: string;
    onStart: AFI[];
    onNewFrame: AFI[];
    variables: ASI[];
    constructor(id: number) {
        this.idInScene = id;
        this.name = 'object';
        this.variables = [];
        this.onStart = [];
        this.onNewFrame = [];
        this.variables.push(ASHandler.CreateI(AS.string, Scope.Public, 'Sprite Path'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'Sprite Width'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'Sprite Height'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'x'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'y'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'z'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'Speed x'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'Speed y'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'Speed z'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'Acceleration x'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'Acceleration y'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'Acceleration z'));
        this.variables.push(ASHandler.CreateI(AS.boolean, Scope.Public, 'Do Rectangular Hitbox'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'Hitbox Radius/Half Width'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'Hitbox Half Height'));
        this.variables.push(ASHandler.CreateI(AS.number, Scope.Public, 'Hitbox Half Thickness'));

        this.variables[1].value = 100;
        this.variables[2].value = 100;
    }
}

export class GEOD3ObjectII {
    anp: AppAndProject;
    instance: GEOD3Object;
    
    constructor(instance: GEOD3Object, anp: AppAndProject, div: HTMLDivElement) {
        this.instance = instance;
        this.anp = anp;
        div.empty();
        const nameDiv = div.createDiv('hbox');
        nameDiv.createEl('div', { text: this.instance.idInScene + ':' } );
        const nameInput = nameDiv.createEl('input', { type: 'text', value: this.instance.name } );
        const editScriptsButton = nameDiv.createEl('button', { text: 'Edit Scripts📜' } );
        editScriptsButton.className = 'geod3-secondary-button';
        nameInput.onchange = () => {
            this.instance.name = nameInput.value;
        }
        editScriptsButton.onclick = () => {
            anp.project.scriptEditor.currentObject = this.instance;
            anp.project.SwitchToTab(anp.project.scriptEditorTabID);
        }
        const variablesDiv = div.createDiv('geod3-inspector-variable-list vbox');
        for (let i = 0; i < this.instance.variables.length; i++) {
            const asI = this.instance.variables[i];
            const varDiv = variablesDiv.createDiv('geod3-inspector-variable hbox');
            varDiv.createEl('div', { text: asI.name } );
            ASHandler.CreateII(asI, varDiv.createDiv());
        }
        const addNewDiv = div.createDiv('hbox');

        const variableNameInput = addNewDiv.createEl('input', { type: 'text', value: 'unnamed' } );
        const variableTypeInput = addNewDiv.createEl('select');
        const addVariableButton = addNewDiv.createEl('button', { text: '+' } );

        addVariableButton.className = 'geod3-add-button';

        for (let i = 1; i < 4; i++) {
            const type = AS[i];
            variableTypeInput.createEl('option', { text: type, value: i + '' } );
        }
        variableTypeInput.value = '1';

        addVariableButton.onclick = () => {
            const name = variableNameInput.value;
            for (let i = 0; i < this.instance.variables.length; i++) {
                if (this.instance.variables[i].name === name) {
                    return;
                }
            }
            const newVar = ASHandler.CreateI(parseInt(variableTypeInput.value), Scope.Public, name);
            this.instance.variables.push(newVar);
            const newVarDiv = variablesDiv.createDiv('geod3-inspector-variable hbox');
            newVarDiv.createEl('div', { text: newVar.name } );
            ASHandler.CreateII(newVar, newVarDiv);
        }
    }
}
export class GEOD3ObjectRI {
    idInScene: number;
    name: string;
    onStart: AFRI[];
    onNewFrame: AFRI[];
    variables: ASI[];
    objDiv: HTMLDivElement;
    anp: AppAndProject;
    private prevSpritePath: string;
    constructor(obj: GEOD3Object, anp: AppAndProject, objDiv: HTMLDivElement) {
        this.idInScene = obj.idInScene;
        this.name = obj.name;
        this.variables = [];
        this.onStart = [];
        this.onNewFrame = [];
        for (let i = 0; i < obj.variables.length; i++) {
            this.variables.push(ASHandler.Copy(obj.variables[i]));
        }
        for (let i = 0; i < obj.onStart.length; i++) {
            this.onStart.push(AFHandler.CreateRI(obj.onStart[i], anp));
        }
        for (let i = 0; i < obj.onNewFrame.length; i++) {
            this.onNewFrame.push(AFHandler.CreateRI(obj.onNewFrame[i], anp));
        }
        this.objDiv = objDiv;
        this.anp = anp;
        this.prevSpritePath = '';
        this.SetObjDivCSSProperties();
    }
    private SetObjDivCSSProperties() {
        this.objDiv.style.transform = 'translate(-50%, 0%)';
        this.objDiv.style.position = 'absolute';
    }
    private RefreshSprite() {
        const spritePath = GEOD3ObjectHandler.GetVariable(this, 'Sprite Path').value;
        if (this.prevSpritePath !== spritePath) {
            try {
                const mediaFile = <ImageFile | VideoFile> this.anp.project.fileManager.GetFileByPrimitivePath(spritePath);
                const spriteSrc = mediaFile.data;
                let mediaEl;
                this.objDiv.empty();
                if (mediaFile instanceof ImageFile) {
                    mediaEl = this.objDiv.createEl('img');
                } else {
                    mediaEl = this.objDiv.createEl('video');
                    mediaEl.controls = false;
                    mediaEl.loop = true;
                }
                mediaEl.src = spriteSrc;
                mediaEl.style.width = '100%';
                mediaEl.style.height = '100%';
                this.prevSpritePath = spritePath;
            } catch {
                console.log('failed to find image/video path');
            }
        }
    }
    private SetLocationAndWidth() {
        const width = GEOD3ObjectHandler.GetVariable(this, 'Sprite Width');
        const height = GEOD3ObjectHandler.GetVariable(this, 'Sprite Height');
        const x = GEOD3ObjectHandler.GetVariable(this, 'x');
        const y = GEOD3ObjectHandler.GetVariable(this, 'y');
        const z = GEOD3ObjectHandler.GetVariable(this, 'z');
        const xVel = GEOD3ObjectHandler.GetVariable(this, 'Speed x');
        const yVel = GEOD3ObjectHandler.GetVariable(this, 'Speed y');
        const zVel = GEOD3ObjectHandler.GetVariable(this, 'Speed z');
        const xAccel = GEOD3ObjectHandler.GetVariable(this, 'Acceleration x');
        const yAccel = GEOD3ObjectHandler.GetVariable(this, 'Acceleration y');
        const zAccel = GEOD3ObjectHandler.GetVariable(this, 'Acceleration z');
        
        this.objDiv.style.width = width.value + 'px';
        this.objDiv.style.height = height.value + 'px';

        xVel.value += xAccel.value;
        yVel.value += yAccel.value;
        zVel.value += zAccel.value;

        x.value += xVel.value;
        y.value += yVel.value;
        z.value += zVel.value;
        
        this.objDiv.style.left = x.value + 'px';
        this.objDiv.style.bottom = y.value + 'px';
    }
    Render() {
        this.RefreshSprite();
        this.SetLocationAndWidth();
    }
    OnStart() {
        for (let i = 0; i < this.onStart.length; i++) {
            this.onStart[i].Execute();
        }
    }
    OnNewFrame() {
        for (let i = 0; i < this.onNewFrame.length; i++) {
            this.onNewFrame[i].Execute();
        }
    }
}
