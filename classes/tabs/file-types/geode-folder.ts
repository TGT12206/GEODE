import { GEODEView } from "classes/geode-view";
import { GEODEFileManager } from "../file-manager";
import { GEODEFile } from "./geode-file";
import { Project } from "classes/project";

export class GEODEFolder extends GEODEFile {
    override type = '📁Folder';
    files: GEODEFile[];
    selectedThumbnail: [GEODEFile, HTMLDivElement] | undefined;

    override get data(): GEODEFile[] {
        return this.files;
    }

    constructor(path: String, parentPath: String, project: Project) {
        super(path, parentPath, project);
        this.files = [];
    }

    override async Open(view: GEODEView, project: Project): Promise<void> {
        const manager = project.fileManager;
        super.Open(view, project);

        const vault = view.app.vault;
        const createDiv = manager.fileDiv.createDiv('hbox');
        const typeDropdown = createDiv.createEl('select');
        for (let i = 0; i < GEODEFileManager.KNOWN_FILE_TYPES.length; i++) {
            const currType = GEODEFileManager.KNOWN_FILE_TYPES[i];
            typeDropdown.createEl('option', { text: currType, value: currType } );
        }
        typeDropdown.value = GEODEFileManager.KNOWN_FILE_TYPES[0];
        const nameInput = createDiv.createEl('input', { type: 'text', value: 'Unnamed' } );
        const addButton = createDiv.createEl('button', { text: '+' } );
        addButton.onclick = async () => {
            const newRelPath = this.path + (this.path.valueOf() === '/' ? '' : '/') + nameInput.value;
            const newPath = project.pathToProject + newRelPath;
            const newGEODEFile = project.fileManager.CreateFileOfType(newRelPath, this.path, typeDropdown.value);
            if (typeDropdown.value === '📁Folder') {
                vault.createFolder(newPath);
            } else {
                vault.create(newPath + '.md', JSON.stringify(newGEODEFile));
            }
            manager.files.push(newGEODEFile);
            this.files.push(newGEODEFile);
            this.Open(view, project);
        }
        this.selectedThumbnail = undefined;

        const folderDiv = manager.fileDiv.createDiv('geode-folder');
        for (let i = 0; i < this.files.length; i++) {
            this.files[i].DisplayThumbnail(view, folderDiv.createDiv('geode-file-thumbnail pointer-hover'));
        }
    }

    SelectFile(view: GEODEView, newSelectedFile: GEODEFile, thumbnailDiv: HTMLDivElement) {
        if (this.selectedThumbnail !== undefined && this.selectedThumbnail[0] === newSelectedFile && this.selectedThumbnail[1] === thumbnailDiv) {
            this.selectedThumbnail[0].Open(view, this.project);
        } else {
            if (this.selectedThumbnail !== undefined) {
                this.selectedThumbnail[1].className = 'geode-file-thumbnail pointer-hover';
            }
            this.selectedThumbnail = [newSelectedFile, thumbnailDiv];
            this.selectedThumbnail[1].className = 'geode-file-thumbnail selected pointer-hover';
            this.selectedThumbnail[0].DisplayProperties(view, thumbnailDiv);
        }
    }

    override async DisplayProperties(view: GEODEView, thumbnailDiv: HTMLDivElement) {
        const manager = this.project.fileManager;
        manager.propertiesDiv.empty();
        const nameInput = manager.propertiesDiv.createEl('input', { type: 'text', value: this.name } );
        manager.propertiesDiv.createEl('div', { text: 'Type: ' + this.type } );
        
        const vault = view.app.vault;

        nameInput.onchange = async () => {
            const originalPath = this.path;
            const tFile = vault.getFolderByPath(this.project.pathToProject + originalPath);
            const currName = this.name;
            const newPath = this.path.slice(0, -currName.length) + nameInput.value;
            if (tFile !== null) {
                vault.rename(tFile, this.project.pathToProject + newPath);
            }
            this.path = newPath;
            const folderStack: [GEODEFolder, number][] = [];
            const GFindex = 0;
            const CFindex = 1;
            folderStack.push([this, 0]);
            let depth = 0;

            while (folderStack[0][CFindex] < this.files.length) {
                const currFolder = folderStack[depth];
                const currIndex = currFolder[CFindex];
                const currFile = currFolder[GFindex].files[currIndex];
                currFile.path = currFile.path.replace(originalPath.valueOf(), newPath);
                if (currFile instanceof GEODEFolder) {
                    folderStack.push([currFile, 0]);
                    depth++;
                } else {
                    currFolder[CFindex]++;
                }
                if (folderStack[depth][CFindex] >= folderStack[depth][GFindex].files.length) {
                    while (depth > 0 && folderStack[depth][CFindex] >= folderStack[depth][GFindex].files.length) {
                        depth--;
                        folderStack.pop();
                        if (depth >= 0) {
                            folderStack[depth][CFindex]++;
                        }
                    }
                }
            }
            this.DisplayThumbnail(view, thumbnailDiv);
        }
    }
}
