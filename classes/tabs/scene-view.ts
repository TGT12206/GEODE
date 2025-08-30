import { normalizePath } from "obsidian";
import { Tab } from "./tab";
import { AppAndProject } from "classes/project";
import { GEOD3Object, GEOD3ObjectHandler } from "./geod3-object";

export class SceneView extends Tab {
    static override icon = '🌐';
    objects: GEOD3Object[];
    hierarchyDiv: HTMLDivElement;
    sceneDiv: HTMLDivElement;
    inspectorDiv: HTMLDivElement;
    
    constructor(anp: AppAndProject) {
        super(anp);
        this.objects = [];
    }

    override Focus(div: HTMLDivElement): void {
        div.empty();

        div.className = 'geod3-tab-container hbox';

        this.hierarchyDiv = div.createDiv('geod3-object-list vbox');
        const sceneScrollWrapper = div.createDiv('geod3-scene-scroll-wrapper');
        const sceneWrapper = sceneScrollWrapper.createDiv('geod3-scene-wrapper');
        this.sceneDiv = sceneWrapper.createDiv('geod3-scene');
        this.inspectorDiv = div.createDiv('geod3-inspector');

        const listDiv = this.hierarchyDiv.createDiv('vbox');

        for (let i = 0; i < this.objects.length; i++) {
            const objectDiv = listDiv.createDiv('geod3-object-in-list hbox pointer-hover');
            const currObj = this.objects[i];
            objectDiv.textContent = currObj.idInScene + ': ' + currObj.name;
            objectDiv.onclick = () => {
                GEOD3ObjectHandler.CreateII(currObj, this.anp, this.inspectorDiv);
            }
        }
        const buttonsDiv = this.hierarchyDiv.createDiv('hbox');
        const refreshButton = buttonsDiv.createEl('button', { text: '⟳' } );
        const addObjButton = buttonsDiv.createEl('button', { text: '+' } );
        refreshButton.className = 'geod3-secondary-button';
        addObjButton.className = 'geod3-add-button';
        refreshButton.style.width = '50%';
        addObjButton.style.width = '50%';
        refreshButton.onclick = () => {
            this.sceneDiv.empty();
            for (let i = 0; i < this.objects.length; i++) {
                const currObj = GEOD3ObjectHandler.CreateRI(this.objects[i], this.anp, this.sceneDiv.createDiv());
                currObj.Render();
            }
        }
        addObjButton.onclick = () => {
            const index = this.objects.length;
            const newObj = new GEOD3Object(index);
            const objectDiv = listDiv.createDiv('geod3-object-in-list hbox pointer-hover');
            objectDiv.createEl('div', { text: newObj.idInScene + ': ' + newObj.name } );
            this.objects.push(newObj);
            objectDiv.onclick = () => {
                GEOD3ObjectHandler.CreateII(newObj, this.anp, this.inspectorDiv);
            }
        }
    }

    override UnFocus(div: HTMLDivElement): void | Promise<void> {
        div.empty();
    }
}