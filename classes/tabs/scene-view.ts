import { Tab } from "./tab";
import { AppAndProject } from "classes/project";
import { GEODEObject } from "../geode-objects/geode-object";
import { GEODEObjectHandler } from "classes/geode-objects/geode-object-handler";

export class SceneView extends Tab {
    static override icon = '🌐';
    objects: GEODEObject[];
    hierarchyDiv: HTMLDivElement;
    sceneDiv: HTMLDivElement;
    inspectorDiv: HTMLDivElement;
    
    constructor(anp: AppAndProject) {
        super(anp);
        this.objects = [];
    }

    override Focus(div: HTMLDivElement): void {
        div.empty();

        div.className = 'geode-tab-container hbox';

        this.hierarchyDiv = div.createDiv('geode-object-list vbox');
        const sceneScrollWrapper = div.createDiv('geode-scene-scroll-wrapper');
        const sceneWrapper = sceneScrollWrapper.createDiv('geode-scene-wrapper');
        this.sceneDiv = sceneWrapper.createDiv('geode-scene');
        this.inspectorDiv = div.createDiv('geode-inspector vbox');

        const listDiv = this.hierarchyDiv.createDiv('vbox');

        for (let i = 0; i < this.objects.length; i++) {
            const objectDiv = listDiv.createDiv('geode-object-in-list hbox pointer-hover');
            const currObj = this.objects[i];
            objectDiv.textContent = currObj.idInScene + ': ' + currObj.name;
            objectDiv.onclick = () => {
                GEODEObjectHandler.CreateEditor(currObj, this.anp, this.inspectorDiv);
            }
        }
        const buttonsDiv = this.hierarchyDiv.createDiv('hbox');
        const refreshButton = buttonsDiv.createEl('button', { text: '⟳' } );
        const addObjButton = buttonsDiv.createEl('button', { text: '+' } );
        refreshButton.className = 'geode-secondary-button';
        addObjButton.className = 'geode-add-button';
        refreshButton.style.width = '50%';
        addObjButton.style.width = '50%';
        refreshButton.onclick = () => {
            this.sceneDiv.empty();
            for (let i = 0; i < this.objects.length; i++) {
                const currObj = GEODEObjectHandler.CreateRuntimeObject(this.objects[i], this.anp, this.sceneDiv.createDiv());
                currObj.Render();
            }
        }
        addObjButton.onclick = () => {
            const index = this.objects.length;
            const newObj = new GEODEObject(index);
            const objectDiv = listDiv.createDiv('geode-object-in-list hbox pointer-hover');
            objectDiv.createEl('div', { text: newObj.idInScene + ': ' + newObj.name } );
            this.objects.push(newObj);
            objectDiv.onclick = () => {
                GEODEObjectHandler.CreateEditor(newObj, this.anp, this.inspectorDiv);
            }
        }
    }

    override UnFocus(div: HTMLDivElement): void | Promise<void> {
        div.empty();
    }
}