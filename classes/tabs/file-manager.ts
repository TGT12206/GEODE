import { TFile, TFolder } from "obsidian";
import { Tab } from "./tab";
import { AppAndProject } from "classes/project";
import { GEOD3File } from "./file-types/geod3-file";
import { GEOD3Folder } from "./file-types/geod3-folder";
import { ImageFile, SoundFile, VideoFile } from "./file-types/real-file";

export class GEOD3FileManager extends Tab {
    static override icon = '📁';
    files: GEOD3File[];
    mainDiv: HTMLDivElement;
    fileDiv: HTMLDivElement;
    propertiesDiv: HTMLDivElement;
    
    get imageFiles(): ImageFile[] {
        const output = [];
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof ImageFile) {
                output.push(<ImageFile> this.files[i]);
            }
        }
        return output;
    }
    
    get soundFiles(): SoundFile[] {
        const output = [];
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof SoundFile) {
                output.push(<SoundFile> this.files[i]);
            }
        }
        return output;
    }
    
    get videoFiles(): VideoFile[] {
        const output = [];
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof VideoFile) {
                output.push(<VideoFile> this.files[i]);
            }
        }
        return output;
    }

    GetFile(path: String) {
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i].path === path) {
                return this.files[i];
            }
        }
        throw new Error('Path ' + path + ' not found');
    }

    GetFileByPrimitivePath(path: string) {
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i].path.valueOf() === path) {
                return this.files[i];
            }
        }
        throw new Error('Path ' + path + ' not found');
    }

    constructor(anp: AppAndProject) {
        super(anp);
        this.files = [];
    }

    static KNOWN_FILE_TYPES = [
        '📁Folder',
        '🖼️Image',
        '🔊Sound',
        '🎞️Video'
    ]

    private AssignObjectFromFileType(plainObj: any, path: string, parentPath: String): GEOD3File {
        plainObj.path = path;
        plainObj.parentPath = parentPath;
        switch(plainObj.type) {
            case '📁Folder':
            default:
                return Object.assign(new GEOD3Folder(path, parentPath), plainObj);
            case '🖼️Image':
                return Object.assign(new ImageFile(path, parentPath), plainObj);
            case '🔊Sound':
                return Object.assign(new SoundFile(path, parentPath), plainObj);
            case '🎞️Video':
                return Object.assign(new VideoFile(path, parentPath), plainObj);
        }
    }

    static CreateFileOfType(path: string, parentPath: String, type: string): GEOD3File {
        switch(type) {
            case '📁Folder':
            default:
                return new GEOD3Folder(path, parentPath);
            case '🖼️Image':
                return new ImageFile(path, parentPath);
            case '🔊Sound':
                return new SoundFile(path, parentPath);
            case '🎞️Video':
                return new VideoFile(path, parentPath);
        }
    }

    async LoadFiles(anp: AppAndProject) {
        this.files = [];
        const app = anp.app;
        const vault = app.vault;
        const project = anp.project;

        const projectFolder = vault.getFolderByPath(project.pathToProject);
        if (projectFolder === null) {
            throw new Error('Project folder does not exist');
        }

        const folderStack: [TFolder, GEOD3Folder, number][] = [];
        const TFindex = 0;
        const GFindex = 1;
        const CFindex = 2;

        const rootPath = new String('/');
        const root = new GEOD3Folder(rootPath, rootPath);
        folderStack.push([projectFolder, root, 0]);
        this.files.push(root);
        let depth = 0;

        while (folderStack[0][CFindex] < projectFolder.children.length) {
            const currFolder = folderStack[depth];
            const currIndex = currFolder[CFindex];
            const currFile = currFolder[TFindex].children[currIndex];
            const relativePath = currFile.path.replace(project.pathToProject, '');
            if (currFile.name !== 'RESERVED FOLDER DO NOT RENAME') {
                if (currFile instanceof TFolder) {
                    const newGEOD3Folder = new GEOD3Folder(relativePath, currFolder[GFindex].path);
                    this.files.push(newGEOD3Folder);
                    currFolder[GFindex].files.push(newGEOD3Folder);
                    folderStack.push([currFile, newGEOD3Folder, 0]);
                    depth++;
                } else if (currFile instanceof TFile) {
                    if (currFile.extension === 'md') {
                        const data = await vault.cachedRead(<TFile> currFile);
                        const plainObj = JSON.parse(data);
                        const newFile = this.AssignObjectFromFileType(plainObj, relativePath.slice(0, -3), currFolder[GFindex].path);
                        currFolder[GFindex].files.push(newFile);
                        this.files.push(newFile);
                    }
                    currFolder[CFindex]++;
                }
            } else {
                currFolder[CFindex]++;
            }
            if (folderStack[depth][CFindex] >= folderStack[depth][TFindex].children.length) {
                while (depth > 0 && folderStack[depth][CFindex] >= folderStack[depth][TFindex].children.length) {
                    depth--;
                    folderStack.pop();
                    if (depth >= 0) {
                        folderStack[depth][CFindex]++;
                    }
                }
            }
        }
    }

    override async Focus(div: HTMLDivElement): Promise<void> {
        div.empty();
        this.mainDiv = div;
        this.mainDiv.className = 'geod3-tab-container hbox';
        this.fileDiv = div.createDiv('vbox');
        this.propertiesDiv = div.createDiv('geod3-file-properties vbox');
        this.fileDiv.style.width = '70%';
        this.propertiesDiv.style.width = '30%';
        this.files[0].Open(this.anp);
    }

    override UnFocus(div: HTMLDivElement): void | Promise<void> {
        div.empty();
    }
}