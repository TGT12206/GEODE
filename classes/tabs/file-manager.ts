import { TFile, TFolder } from "obsidian";
import { Tab } from "./tab";
import { GEODEFile } from "./file-types/geode-file";
import { GEODEFolder } from "./file-types/geode-folder";
import { ImageFile, SoundFile, VideoFile } from "./file-types/real-file";
import { Project } from "classes/project";
import { GEODEView } from "classes/geode-view";

export class GEODEFileManager extends Tab {
    static override icon = '📁';
    files: GEODEFile[];
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

    constructor(project: Project) {
        super(project);
        this.files = [];
    }

    static KNOWN_FILE_TYPES = [
        '📁Folder',
        '🖼️Image',
        '🔊Sound',
        '🎞️Video'
    ]

    private AssignObjectFromFileType(plainObj: any, path: string, parentPath: String): GEODEFile {
        plainObj.path = path;
        plainObj.parentPath = parentPath;
        switch(plainObj.type) {
            case '📁Folder':
            default:
                return Object.assign(new GEODEFolder(path, parentPath), plainObj);
            case '🖼️Image':
                return Object.assign(new ImageFile(path, parentPath), plainObj);
            case '🔊Sound':
                return Object.assign(new SoundFile(path, parentPath), plainObj);
            case '🎞️Video':
                return Object.assign(new VideoFile(path, parentPath), plainObj);
        }
    }

    CreateFileOfType(path: string, parentPath: String, type: string): GEODEFile {
        switch(type) {
            case '📁Folder':
            default:
                return new GEODEFolder(path, parentPath);
            case '🖼️Image':
                return new ImageFile(path, parentPath);
            case '🔊Sound':
                return new SoundFile(path, parentPath);
            case '🎞️Video':
                return new VideoFile(path, parentPath);
        }
    }

    async LoadFiles(view: GEODEView) {
        this.files = [];
        const vault = view.app.vault;

        const projectFolder = vault.getFolderByPath(this.project.pathToProject);
        if (projectFolder === null) {
            throw new Error('Project folder does not exist');
        }

        const folderStack: [TFolder, GEODEFolder, number][] = [];
        const TFindex = 0;
        const GFindex = 1;
        const CFindex = 2;

        const rootPath = new String('/');
        const root = new GEODEFolder(rootPath, rootPath);
        folderStack.push([projectFolder, root, 0]);
        this.files.push(root);
        let depth = 0;

        while (folderStack[0][CFindex] < projectFolder.children.length) {
            const currFolder = folderStack[depth];
            const currIndex = currFolder[CFindex];
            const currFile = currFolder[TFindex].children[currIndex];
            const relativePath = currFile.path.replace(this.project.pathToProject, '');
            if (currFile.name !== 'RESERVED FOLDER DO NOT RENAME') {
                if (currFile instanceof TFolder) {
                    const newGEODEFolder = new GEODEFolder(relativePath, currFolder[GFindex].path);
                    this.files.push(newGEODEFolder);
                    currFolder[GFindex].files.push(newGEODEFolder);
                    folderStack.push([currFile, newGEODEFolder, 0]);
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

    override async Focus(div: HTMLDivElement, view: GEODEView): Promise<void> {
        div.empty();
        this.mainDiv = div;
        this.mainDiv.className = 'geode-tab-container hbox';
        this.fileDiv = div.createDiv('geode-file-manager-files vbox');
        this.propertiesDiv = div.createDiv('geode-file-properties vbox');
        this.files[0].Open(view, this.project);
    }

    override async UnFocus(div: HTMLDivElement, view: GEODEView): Promise<void> {
        div.empty();
    }
}