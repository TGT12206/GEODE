import { Tab } from "./tab";
import { GEODEObject } from "../geode-objects/geode-object";
import { GEODEObjectHandler } from "classes/geode-objects/geode-object-handler";
import { GEODEView } from "classes/geode-view";
import { Project } from "classes/project";

export class SceneView extends Tab {
    static override icon = '🌐';
    objects: GEODEObject[];
    hierarchyDiv: HTMLDivElement;
    sceneDiv: HTMLDivElement;
    inspectorDiv: HTMLDivElement;
    
    constructor(project: Project) {
        super(project);
        this.objects = [];
    }

    override async Focus(div: HTMLDivElement, view: GEODEView): Promise<void> {
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
            view.registerDomEvent(objectDiv, 'click', () => {
                GEODEObjectHandler.CreateEditor(currObj, view, this.project, this.inspectorDiv);
            });
        }
        const buttonsDiv = this.hierarchyDiv.createDiv('hbox');
        const refreshButton = buttonsDiv.createEl('button', { text: '⟳' } );
        const addObjButton = buttonsDiv.createEl('button', { text: '+' } );
        refreshButton.className = 'geode-secondary-button';
        addObjButton.className = 'geode-add-button';
        view.registerDomEvent(refreshButton, 'click', () => {
            this.sceneDiv.empty();
            for (let i = 0; i < this.objects.length; i++) {
                const currObj = GEODEObjectHandler.CreateRuntimeObject(this.objects[i], this.project, this.sceneDiv.createDiv());
                currObj.Render();
            }
        });
        view.registerDomEvent(addObjButton, 'click', () => {
            const index = this.objects.length;
            const newObj = new GEODEObject(index);
            const objectDiv = listDiv.createDiv('geode-object-in-list hbox pointer-hover');
            objectDiv.createEl('div', { text: newObj.idInScene + ': ' + newObj.name } );
            this.objects.push(newObj);
            view.registerDomEvent(objectDiv, 'click', () => {
                GEODEObjectHandler.CreateEditor(newObj, view, this.project, this.inspectorDiv);
            });
        });
    }

    override async UnFocus(div: HTMLDivElement): Promise<void> {
        div.empty();
    }
}