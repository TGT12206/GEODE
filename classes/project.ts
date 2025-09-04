import { App, normalizePath } from "obsidian";
import { GameView } from "./tabs/game-view";
import { SceneView } from "./tabs/scene-view";
import { ScriptEditor } from "./tabs/script-editor";
import { Tab } from "./tabs/tab";
import { GEODEObject } from "./geode-objects/geode-object";
import { GEODEFileManager } from "./tabs/file-manager";
import { AmethystFunction } from "./amethyst-scripting/functions/function";
import { AmethystFunctionHandler } from "./amethyst-scripting/functions/function-handler";
import { AmethystStructHandler } from "./amethyst-scripting/structs/struct-handler";
import { GEODEView } from "./geode-view";

export class Project {
    pathToProject: string;
    tabs: Tab[];

    get fileManager(): GEODEFileManager {
        return <GEODEFileManager> this.tabs[0];
    }

    get sceneView(): SceneView {
        return <SceneView> this.tabs[1];
    }

    get scriptEditor(): ScriptEditor {
        return <ScriptEditor> this.tabs[2];
    }

    get gameView(): GameView {
        return <GameView> this.tabs[3];
    }

    get fileManagerTabID(): number {
        return 0;
    }

    get sceneViewTabID(): number {
        return 1;
    }

    get scriptEditorTabID(): number {
        return 2;
    }

    get gameViewTabID(): number {
        return 3;
    }

    activeTabID: number;

    SwitchToTab: (index: number) => Promise<void>;

    constructor() {
        this.tabs = [];
        this.tabs.push(new GEODEFileManager(this));
        this.tabs.push(new SceneView(this));
        this.tabs.push(new ScriptEditor(this));
        this.tabs.push(new GameView(this));
        this.activeTabID = 0;
    }

    async Load(view: GEODEView) {
        await this.LoadFiles(view);
        await this.GrabFileDependencies(view);
        await this.LoadObjects(view);
    }
    async LoadFiles(view: GEODEView) {
        await this.fileManager.LoadFiles(view);
    }
    async GrabFileDependencies(view: GEODEView) {
        const fm = this.fileManager;
        for (let i = 0; i < fm.files.length; i++) {
            await fm.files[i].GrabDependencies(view);
        }
    }
    async LoadObjects(view: GEODEView) {
        const sv = this.sceneView;
        const path = normalizePath(this.pathToProject + '/RESERVED FOLDER DO NOT RENAME/Objects.md');
        const tFile = view.app.vault.getFileByPath(path);
        if (tFile === null) {
            return;
        }
        const data = await view.app.vault.cachedRead(tFile);
        const plainObj = JSON.parse(data);
        sv.objects = plainObj.objects;
        const loadFunction = (plainFunct: any): AmethystFunction => {
            const newFunct = Object.assign(AmethystFunctionHandler.Create(plainFunct.type, plainFunct.parameters), plainFunct);
            for (let i = 0; i < newFunct.defaultParameters.length; i++) {
                const isStruct = plainFunct.defaultParameters[i].name !== undefined;
                if (isStruct) {
                    const plainStruct = plainFunct.defaultParameters[i];
                    newFunct.defaultParameters[i] = Object.assign(AmethystStructHandler.Create(plainStruct.type, plainStruct.value, plainStruct.name), plainStruct);
                } else {
                    newFunct.defaultParameters[i] = loadFunction(plainFunct.defaultParameters[i]);
                }
            }
            for (let i = 0; i < newFunct.parameters.length; i++) {
                const isStruct = plainFunct.parameters[i].name !== undefined;
                if (isStruct) {
                    const plainStruct = plainFunct.parameters[i];
                    newFunct.parameters[i] = Object.assign(AmethystStructHandler.Create(plainStruct.type, plainStruct.value, plainStruct.name), plainStruct);
                } else {
                    newFunct.parameters[i] = loadFunction(plainFunct.parameters[i]);
                }
            }
            return newFunct;
        }
        for (let i = 0; i < plainObj.objects.length; i++) {
            const newObj = Object.assign(new GEODEObject(i), plainObj.objects[i]);
            sv.objects[i] = newObj;
            for (let j = 0; j < newObj.variables.length; j++) {
                const plainVar = sv.objects[i].variables[j];
                const newVar = Object.assign(AmethystStructHandler.Create(plainVar.type, plainVar.value, plainVar.name), plainVar);
                sv.objects[i].variables[j] = newVar;
            }
            for (let j = 0; j < newObj.onStart.length; j++) {
                const plainFunct = sv.objects[i].onStart[j];
                const newFunct = loadFunction(plainFunct);
                sv.objects[i].onStart[j] = newFunct;
            }
            for (let j = 0; j < newObj.onNewFrame.length; j++) {
                const plainFunct = sv.objects[i].onNewFrame[j];
                const newFunct = loadFunction(plainFunct);
                sv.objects[i].onNewFrame[j] = newFunct;
            }
        }
    }

    async Display(div: HTMLDivElement, view: GEODEView) {
        div.empty();

        const tabBar = div.createDiv('geode-tab-bar hbox');
        const tabContainer = div.createDiv('geode-tab-container');

        const tabIcons: HTMLElement[] = [];

        const filesTab = tabBar.createEl('button', { text: GEODEFileManager.icon } );
        const sceneViewTab = tabBar.createEl('button', { text: SceneView.icon } );
        const scriptEditorTab = tabBar.createEl('button', { text: ScriptEditor.icon } );
        const gameTab = tabBar.createEl('button', { text: GameView.icon } );
        const saveButton = tabBar.createEl('button', { text: '💾Save' } );
        saveButton.className = 'geode-secondary-button';
        view.registerDomEvent(saveButton, 'click', async () => {
            saveButton.disabled = true;
            saveButton.textContent = '⟳Saving...';
            const path = normalizePath(this.pathToProject + '/RESERVED FOLDER DO NOT RENAME/Objects.md');
            const data = JSON.stringify(new SceneDTO(this.sceneView.objects));
            await view.app.vault.adapter.write(path, data);
            saveButton.disabled = false;
            saveButton.textContent = '💾Save';
        });

        filesTab.className = 'geode-tab-icon';
        sceneViewTab.className = 'geode-tab-icon';
        scriptEditorTab.className = 'geode-tab-icon';
        gameTab.className = 'geode-tab-icon';

        tabIcons.push(filesTab);
        tabIcons.push(sceneViewTab);
        tabIcons.push(scriptEditorTab);
        tabIcons.push(gameTab);

        tabIcons[this.activeTabID].className = 'geode-tab-icon-opened';
        this.tabs[this.activeTabID].Focus(tabContainer, view);

        const switchToTab = async (index: number) => {
            tabIcons[this.activeTabID].className = 'geode-tab-icon';
            await this.tabs[this.activeTabID].UnFocus(tabContainer, view);
            this.activeTabID = index;
            tabIcons[this.activeTabID].className = 'geode-tab-icon-opened';
            this.tabs[this.activeTabID].Focus(tabContainer, view);
        }

        this.SwitchToTab = switchToTab;

        view.registerDomEvent(filesTab, 'click', () => {
            switchToTab(0);
        });
        view.registerDomEvent(sceneViewTab, 'click', () => {
            switchToTab(1);
        });
        view.registerDomEvent(scriptEditorTab, 'click', () => {
            switchToTab(2);
        });
        view.registerDomEvent(gameTab, 'click', () => {
            switchToTab(3);
        });
    }
}

export class SceneDTO {
    objects: GEODEObject[];
    constructor(objects: GEODEObject[] = []) {
        this.objects = objects;
    }
}