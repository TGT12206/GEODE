import { AppAndProject } from 'classes/project';
import { GEOD3FileManager } from '../file-manager';
import { GEOD3Folder } from './geod3-folder';
import { normalizePath } from 'obsidian';

export abstract class GEOD3File {
    parentPath: String;
    getParent(manager: GEOD3FileManager): GEOD3Folder {
        return <GEOD3Folder> manager.GetFile(this.parentPath);
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
    constructor(path: String, parentPath: String) {
        this.parentPath = parentPath;
        this.path = path;
    }
    async GrabDependencies(anp: AppAndProject): Promise<void> {}
    async DisplayThumbnail(anp: AppAndProject, thumbnailDiv: HTMLDivElement): Promise<void> {
        const manager = anp.project.fileManager;
        thumbnailDiv.empty();
		thumbnailDiv.onclick = async () => {
            this.getParent(manager).SelectFile(anp, this, thumbnailDiv);
		}
		thumbnailDiv.createEl('div', { text: this.name } );
		thumbnailDiv.createEl('div', { text: 'Type: ' + this.type } );
    }
    async Open(anp: AppAndProject): Promise<void> {
        const manager = anp.project.fileManager;
        manager.fileDiv.empty();
        manager.fileDiv.className = 'vbox';

        const backButton = manager.fileDiv.createEl('button', { text: 'Go back to ' + this.getParent(manager).name } );

        backButton.onclick = async () => {
            this.getParent(manager).Open(anp);
        }
    }
    async DisplayProperties(anp: AppAndProject, thumbnailDiv: HTMLDivElement) {
        const manager = anp.project.fileManager;
        manager.propertiesDiv.empty();
		const nameInput = manager.propertiesDiv.createEl('input', { type: 'text', value: this.name } );
		manager.propertiesDiv.createEl('div', { text: 'Type: ' + this.type } );
        
        const vault = anp.app.vault;
        const project = anp.project;

        nameInput.onchange = async () => {
            const originalPath = this.path;
            const tFile = vault.getFileByPath(project.pathToProject + originalPath + '.md');
            const currName = this.name;
            const newPath = this.path.slice(0, -currName.length) + nameInput.value;
            if (tFile !== null) {
                vault.rename(tFile, project.pathToProject + newPath + '.md');
            }
            this.path = newPath;
            this.DisplayThumbnail(anp, thumbnailDiv);
        }
    }
    async Save(anp: AppAndProject) {
        const path = normalizePath(anp.project.pathToProject + this.path + '.md');
        anp.app.vault.adapter.write(path, JSON.stringify(this.data));
    }
}
