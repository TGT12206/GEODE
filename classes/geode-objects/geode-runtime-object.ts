import { AmethystRuntimeFunction } from "classes/amethyst-scripting/functions/runtime-function";
import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AppAndProject } from "classes/project";
import { GEODEObject } from "./geode-object";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { AmethystFunctionHandler } from "classes/amethyst-scripting/functions/function-handler";
import { GEODEObjectHandler } from "./geode-object-handler";
import { ImageFile, VideoFile } from "classes/tabs/file-types/real-file";

export class GEODERuntimeObject {
    idInScene: number;
    name: string;
    onStart: AmethystRuntimeFunction[];
    onNewFrame: AmethystRuntimeFunction[];
    variables: AmethystStruct[];
    objDiv: HTMLDivElement;
    anp: AppAndProject;
    private prevSpritePath: string;
    constructor(obj: GEODEObject, anp: AppAndProject, objDiv: HTMLDivElement) {
        this.idInScene = obj.idInScene;
        this.name = obj.name;
        this.variables = [];
        this.onStart = [];
        this.onNewFrame = [];
        for (let i = 0; i < obj.variables.length; i++) {
            this.variables.push(AmethystStructHandler.Copy(obj.variables[i]));
        }
        for (let i = 0; i < obj.onStart.length; i++) {
            this.onStart.push(AmethystFunctionHandler.CreateRuntimeInstance(obj.onStart[i], anp));
        }
        for (let i = 0; i < obj.onNewFrame.length; i++) {
            this.onNewFrame.push(AmethystFunctionHandler.CreateRuntimeInstance(obj.onNewFrame[i], anp));
        }
        this.objDiv = objDiv;
        this.anp = anp;
        this.prevSpritePath = '';
        this.SetObjDivCSSProperties();
    }
    private SetObjDivCSSProperties() {
        this.objDiv.style.transform = 'translate(-50%, 50%)';
        this.objDiv.style.position = 'absolute';
    }
    private RefreshSprite() {
        const spritePath = GEODEObjectHandler.GetVariable(this, 'Sprite Path').value;
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
        const width = GEODEObjectHandler.GetVariable(this, 'Sprite Width');
        const height = GEODEObjectHandler.GetVariable(this, 'Sprite Height');
        const x = GEODEObjectHandler.GetVariable(this, 'x');
        const y = GEODEObjectHandler.GetVariable(this, 'y');
        const z = GEODEObjectHandler.GetVariable(this, 'z');
        const xVel = GEODEObjectHandler.GetVariable(this, 'Velocity x');
        const yVel = GEODEObjectHandler.GetVariable(this, 'Velocity y');
        const zVel = GEODEObjectHandler.GetVariable(this, 'Velocity z');
        const xAccel = GEODEObjectHandler.GetVariable(this, 'Acceleration x');
        const yAccel = GEODEObjectHandler.GetVariable(this, 'Acceleration y');
        const zAccel = GEODEObjectHandler.GetVariable(this, 'Acceleration z');
        
        // console.log('values:\n' + 
        //     'Acc: ' + xAccel.value + ', ' + yAccel.value + ', ' + zAccel.value + '\n' +
        //     'Vel: ' + xVel.value + ', ' + yVel.value + ', ' + zVel.value + '\n' +
        //     'Pos: ' + x.value + ', ' + y.value + ', ' + z.value + '\n'
        // );

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