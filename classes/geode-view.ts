import { ItemView, normalizePath, WorkspaceLeaf } from 'obsidian';
import { Project, SceneDTO } from './project';

export const VIEW_TYPE_GEODE_PROJECT = 'geode-view';

export const GEODE_RESERVED_FOLDER = 'RESERVED FOLDER DO NOT RENAME/';

/**
 * Opens a project
 */
export class GEODEView extends ItemView {
    defaultPath: string;
    project: Project;
    constructor(leaf: WorkspaceLeaf, defaultPath: string) {
        super(leaf);
        this.defaultPath = defaultPath;
    }

    getViewType() {
        return VIEW_TYPE_GEODE_PROJECT;
    }

    getDisplayText() {
        return 'GEODE';
    }

    async onOpen() {
        const mainEl = this.containerEl.children[1];
        mainEl.empty();
        
        const mainDiv = mainEl.createDiv('geode-main-div');

        const projectSelectDiv = mainDiv.createDiv();

        projectSelectDiv.tabIndex = -1;
        projectSelectDiv.focus();

        projectSelectDiv.createEl('h1', { text: 'Path to project:' } );
        const pathInput = projectSelectDiv.createEl('input', { type: 'text', value: this.defaultPath } );
        const submitButton = projectSelectDiv.createEl('button', { text: 'Open' } );
        
        submitButton.onclick = () => { this.OnSubmit(pathInput.value, mainDiv) };

        /**
         * Not sure if events need to be registered if the node gets removed?
         */
        this.registerEvent(projectSelectDiv.onkeydown = (e) => {
            if (e.key === 'Enter') {
                projectSelectDiv.remove();
                this.OnSubmit(pathInput.value, mainDiv);
            }
        })
    }

    /**
     * Based on the vault path given, load an existing project or create a new one.
     * @param path The vault path to the project folder to load.
     * @param mainDiv The div to display the project in.
     */
    private async OnSubmit(path: string, mainDiv: HTMLDivElement) {
        const projectPath = normalizePath(path);
        const dataPath = projectPath + '/' + GEODE_RESERVED_FOLDER + 'Objects.md';
        this.project = new Project(this.app);
        this.project.pathToProject = projectPath;
        if (!await this.app.vault.adapter.exists(dataPath)) {
            await this.CreateDataFile(dataPath);
        }
        await this.project.Load();
        await this.project.Display(mainDiv);
    }

    /**
     * Create the data file and its parent folders if they don't exist yet.
     * @param pathToData The path to the data file to create.
     */
    private async CreateDataFile(pathToData: string) {
        const newDTO = new SceneDTO();
        const pathParts = pathToData.split('/');
        let pathSoFar = '';
        for (let i = 0; !(await this.app.vault.adapter.exists(pathToData)) && i < pathParts.length; i++) {
            const isLast = i === pathParts.length - 1;
            pathSoFar += pathParts[i] + (isLast ? '' : '/');
            if (isLast) {
                await this.app.vault.create(pathSoFar, JSON.stringify(newDTO));
            } else {
                await this.app.vault.createFolder(pathSoFar);
            }
        }
    }

    async onClose() {
        this.project.gameView.stillRunning = false;
    }
}
