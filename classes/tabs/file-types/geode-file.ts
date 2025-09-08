import { Project } from 'classes/project';
import { GEODEFolder } from './geode-folder';
import { normalizePath } from 'obsidian';
import { GEODEView } from 'classes/geode-view';

export abstract class GEODEFile {
    parentPath: String;
    project: Project;
    getParent(): GEODEFolder {
        return <GEODEFolder> this.project.fileManager.GetFile(this.parentPath);
    }

    /**
     * The path to this file RELATIVE TO THE PROJECT FOLDER, NOT THE VAULT
     */
    path: String;
    get name(): string {
        const pathParts = this.path.valueOf().split('/');
        if (this.path.valueOf() === '/') {
            return 'root';
        }
        return pathParts[pathParts.length - 1];
    }

    type: string;
    abstract get data(): any;
    constructor(path: String, parentPath: String, project: Project) {
        this.parentPath = parentPath;
        this.path = path;
        this.project = project;
    }
    async GrabDependencies(view: GEODEView): Promise<void> {}
    async DisplayThumbnail(view: GEODEView, thumbnailDiv: HTMLDivElement): Promise<void> {
        const manager = this.project.fileManager;
        thumbnailDiv.empty();
		thumbnailDiv.onclick = async () => {
            this.getParent().SelectFile(view, this, thumbnailDiv);
		}
		thumbnailDiv.createEl('div', { text: this.name } );
		thumbnailDiv.createEl('div', { text: 'Type: ' + this.type } );
    }
    async Open(view: GEODEView, project: Project): Promise<void> {
        const manager = project.fileManager;
        manager.fileDiv.empty();
        manager.fileDiv.className = 'geode-file-manager-files vbox';

        const backButton = manager.fileDiv.createEl('button', { text: 'Go back to ' + this.getParent().name } );

        backButton.onclick = async () => {
            this.getParent().Open(view, project);
        }
    }
    async DisplayProperties(view: GEODEView, thumbnailDiv: HTMLDivElement) {
        const manager = this.project.fileManager;
        manager.propertiesDiv.empty();
		const nameInput = manager.propertiesDiv.createEl('input', { type: 'text', value: this.name } );
		manager.propertiesDiv.createEl('div', { text: 'Type: ' + this.type } );
        
        const vault = view.app.vault;

        nameInput.onchange = async () => {
            const originalPath = this.path;
            const tFile = vault.getFileByPath(this.project.pathToProject + originalPath + '.md');
            const currName = this.name;
            const newPath = this.path.slice(0, -currName.length) + nameInput.value;
            if (tFile !== null) {
                vault.rename(tFile, this.project.pathToProject + newPath + '.md');
            }
            this.path = newPath;
            this.DisplayThumbnail(view, thumbnailDiv);
        }
    }
    async Save(view: GEODEView, project: Project) {
        const path = normalizePath(project.pathToProject + this.path + '.md');
        view.app.vault.adapter.write(path, JSON.stringify(this.data));
    }
}
