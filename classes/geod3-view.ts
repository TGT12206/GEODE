import { ItemView, normalizePath, WorkspaceLeaf } from 'obsidian';
import { Project, SceneDTO } from './project';

export const VIEW_TYPE_GEOD3_PROJECT = 'geod3-view';

/**
 * Opens a project
 */
export class GEOD3View extends ItemView {
    defaultPath: string;
    project: Project;
    constructor(leaf: WorkspaceLeaf, defaultPath: string) {
        super(leaf);
        this.defaultPath = defaultPath;
    }

    getViewType() {
        return VIEW_TYPE_GEOD3_PROJECT;
    }

    getDisplayText() {
        return 'GEO:D3';
    }

    async onOpen() {
        const mainEl = this.containerEl.children[1];
        mainEl.empty();
        
        const mainDiv = mainEl.createDiv('geod3-main-div');
        const mainDivTemp = mainDiv.createDiv('geod3-main-div');

        mainDivTemp.tabIndex = -1;
        mainDivTemp.focus();

        mainDivTemp.createEl('h1', { text: 'Path to project:' } );
        const pathInput = mainDivTemp.createEl('input', { type: 'text', value: this.defaultPath } );
        const submitButton = mainDivTemp.createEl('button', { text: 'Open' } );
        
        const onSubmit = async () => {
            const folderPath = normalizePath(pathInput.value);
            const dataPath = folderPath + '/RESERVED FOLDER DO NOT RENAME/Objects.md';
            this.project = new Project(this.app);
            this.project.pathToProject = folderPath;
            if (!await this.app.vault.adapter.exists(dataPath)) {
                const newDTO = new SceneDTO();

                const pathParts = dataPath.split('/');
                let pathSoFar = '';
                for (let i = 0; !(await this.app.vault.adapter.exists(dataPath)) && i < pathParts.length; i++) {
                    const isLast = i === pathParts.length - 1;
                    pathSoFar += pathParts[i] + (isLast ? '' : '/');
                    if (isLast) {
                        await this.app.vault.create(pathSoFar, JSON.stringify(newDTO));
                    } else {
                        await this.app.vault.createFolder(pathSoFar);
                    }
                }
            }
            await this.project.Load();
            await this.project.Display(mainDiv);
        }
        submitButton.onclick = onSubmit;
        mainDivTemp.onkeydown = (e) => {
            if (e.key === 'Enter') {
                mainDivTemp.onkeydown = () => {};
                onSubmit();
            }
        }
    }

    async onClose() {
        this.project.gameView.stillRunning = false;
    }
}
