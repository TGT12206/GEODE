import { GEODEView } from "classes/geode-view";
import { GEODEFile } from "./geode-file";
import { normalizePath } from "obsidian";
import { Project } from "classes/project";

export abstract class RealFile extends GEODEFile {
    protected src: string;
    protected originalFileName: string;
    override get data(): string {
        return this.src;
    }

    constructor(path: String, parentPath: String) {
        super(path, parentPath);
        this.src = '';
    }
    override async Open(view: GEODEView, project: Project): Promise<void> {
        const manager = project.fileManager;
        super.Open(view, project);
        this.DisplayActualFile(manager.fileDiv);
    }
    override async GrabDependencies(view: GEODEView, project: Project): Promise<void> {
        this.src = '';
        try {
            const vault = view.app.vault;
            const pathToActualFile = project.pathToProject + this.path + '.actual-file';
            const tFile = vault.getFileByPath(pathToActualFile);
            if (tFile === null) {
                throw new Error('');
            }
            const arrayBuffer = await vault.readBinary(tFile);
            const blob = new Blob([arrayBuffer]);
            this.src = URL.createObjectURL(blob);
        } catch {
            
        }
    }
    override async DisplayProperties(view: GEODEView, thumbnailDiv: HTMLDivElement, project: Project): Promise<void> {
        const manager = project.fileManager;
        manager.propertiesDiv.empty();
		const nameInput = manager.propertiesDiv.createEl('input', { type: 'text', value: this.name } );
		manager.propertiesDiv.createEl('div', { text: 'Type: ' + this.type } );
		const currFileDiv = manager.propertiesDiv.createDiv();
        this.DisplayActualFile(currFileDiv);
		const fileInput = manager.propertiesDiv.createEl('input', { type: 'file' } );
		
        const vault = view.app.vault;

        nameInput.onchange = async () => {
            const originalPath = this.path;
            const tFile1 = vault.getFileByPath(project.pathToProject + originalPath + '.md');
            const tFile2 = vault.getFileByPath(project.pathToProject + originalPath + '.actual-file');
            const currName = this.name;
            const newPath = this.path.slice(0, -currName.length) + nameInput.value;
            if (tFile1 !== null) {
                vault.rename(tFile1, project.pathToProject + newPath + '.md');
            }
            if (tFile2 !== null) {
                vault.rename(tFile2, project.pathToProject + newPath + '.actual-file');
            }
            this.path = newPath;
            this.DisplayThumbnail(view, thumbnailDiv, project);
        }
        fileInput.onchange = async () => {
            const fileArray = fileInput.files;
            if (fileArray !== null) {
                const file = fileArray[0];
                this.originalFileName = file.name;
                const arrayBuffer = await file.arrayBuffer();
                const blob = new Blob([arrayBuffer]);
                this.src = URL.createObjectURL(blob);
                const pathToMDFile = normalizePath(project.pathToProject + this.path + '.md');
                const pathToActualFile = normalizePath(project.pathToProject + this.path + '.actual-file');
                await vault.adapter.write(pathToMDFile, JSON.stringify(this));
                await vault.adapter.writeBinary(pathToActualFile, arrayBuffer);
            }
            currFileDiv.empty();
            this.DisplayActualFile(currFileDiv);
        }
    }
    abstract DisplayActualFile(div: HTMLDivElement): Promise<HTMLElement>;
    async Save(view: GEODEView, project: Project): Promise<void> {
        await super.Save(view, project);
        try {
            const response = await fetch(this.data);
            const arrayBuffer = await response.arrayBuffer();
            const pathToActualFile = normalizePath(project.pathToProject + this.path + '.actual-file');
            await view.app.vault.adapter.writeBinary(pathToActualFile, arrayBuffer);
        } catch {
            console.log('Error converting ' + this.path.valueOf() + ' to an actual file');
        }
    }
}

export class ImageFile extends RealFile {
    override type = '🖼️Image';
    override async DisplayActualFile(div: HTMLDivElement): Promise<HTMLImageElement> {
        const img = div.createEl('img');
        img.style.objectFit = 'contain';
        img.src = this.src;
        return img;
    }
}

export class SoundFile extends RealFile {
    override type = '🔊Sound';
    override async DisplayActualFile(div: HTMLDivElement): Promise<HTMLAudioElement> {
        const el = div.createEl('audio');
        el.src = this.src;
        return el;
    }
}

export class VideoFile extends RealFile {
    override type = '🎞️Video';
    override async DisplayActualFile(div: HTMLDivElement): Promise<HTMLVideoElement> {
        const vid = div.createEl('video');
        vid.style.objectFit = 'contain';
        vid.src = this.src;
        return vid;
    }
}
