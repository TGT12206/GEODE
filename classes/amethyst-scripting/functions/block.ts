import { AmethystFunction } from "./function";
import { AmethystStruct } from "../structs/struct";
import { AmethystFunctionHandler } from "./function-handler";
import { AmethystStructHandler } from "../structs/struct-handler";
import { Project } from "classes/project";
import { GEODEView } from "classes/geode-view";

export abstract class AmethystBlock {
    project: Project;
    instance: AmethystFunction;
    div: HTMLDivElement;
    parentEI: AmethystBlock | undefined;
    constructor(instance: AmethystFunction, blockDiv: HTMLDivElement, view: GEODEView, project: Project) {
        this.instance = instance;
        this.div = blockDiv;
        this.project = project;
        this.DisplayBlock(view);
    }
    
    DisplayBlock(view: GEODEView): void {
        this.div.empty();
        this.div.className = 'geode-script-block';
    }
    static AdjustDropdownWidth(input: HTMLInputElement | HTMLSelectElement, div: HTMLDivElement) {
        const tempEl = div.createEl('div', { text: input.value } );
        tempEl.className = 'geode-temporary-select-width-checker';
        input.style.width = tempEl.getBoundingClientRect().width + 'px';
        tempEl.remove();
    }
    CreateValOrFunctParameterDiv(index: number, paramDiv: HTMLDivElement, view: GEODEView): void | AmethystBlock {
        const param = this.instance.parameters[index];
        if (param instanceof AmethystStruct) {
            return this.CreateValParameterDiv(index, paramDiv, view);
        } else {
            return this.CreateFunctParameterDiv(index, paramDiv, view);
        }
    }
    CreateValParameterDiv(index: number, paramDiv: HTMLDivElement, view: GEODEView): void {
        AmethystBlock.SetParameterDiv(view, this.project, this, paramDiv, index);
        const param = <AmethystStruct> this.instance.parameters[index];
        AmethystStructHandler.CreateEditor(param, paramDiv, view);
    }
    CreateFunctParameterDiv(index: number, paramDiv: HTMLDivElement, view: GEODEView): AmethystBlock {
        AmethystBlock.SetParameterDiv(view, this.project, this, paramDiv, index);
        const param = <AmethystFunction> this.instance.parameters[index];
        const paramEI = AmethystFunctionHandler.CreateBlock(param, paramDiv, view, this.project);
        paramEI.parentEI = this;
        if (paramEI.instance.type !== 'none') {
            AmethystBlock.MakeBlockDraggable(paramEI, view, this.project, false);
        }
        return paramEI;
    }
    RemoveParameter(parameter: AmethystFunction): void {
        for (let i = 0; i < this.instance.parameters.length; i++) {
            if (this.instance.parameters[i] === parameter) {
                const currDefaultParam = this.instance.defaultParameters[i];
                this.instance.parameters[i] = currDefaultParam instanceof AmethystStruct ? AmethystStructHandler.Copy(currDefaultParam) : AmethystFunctionHandler.Copy(currDefaultParam);
            }
        }
    }
    static MakeBlockDraggable(block: AmethystBlock, view: GEODEView, project: Project, isCopy: boolean) {
        const scriptEditor = project.scriptEditor;
        block.div.draggable = true;
        view.registerDomEvent(block.div, 'dragstart', (event: DragEvent) => {
            event.stopPropagation();
            if (event.dataTransfer !== null) {
                event.dataTransfer.effectAllowed = 'copy';
            }
            scriptEditor.currentlyDraggedBlockIsCopy = isCopy;
            scriptEditor.currentlyDraggedBlock = block;
            scriptEditor.blocksDiv.style.height = '90%';
            scriptEditor.delDiv.style.height = '10%';
        });

        view.registerDomEvent(block.div, 'dragend', (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
            scriptEditor.blocksDiv.style.height = '100%';
            scriptEditor.delDiv.style.height = '0%';
        });
    }
    protected static SetParameterDiv(view: GEODEView, project: Project, afei: AmethystBlock, paramDiv: HTMLDivElement, paramIndex: number) {
        const scriptEditor = project.scriptEditor;

        view.registerDomEvent(paramDiv, 'dragover', (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
            if (event.dataTransfer !== null) {
                event.dataTransfer.dropEffect = "copy";
            }
            paramDiv.classList.add('geode-block-slot-hover');
        });

        view.registerDomEvent(paramDiv, 'dragleave', (event: DragEvent) => {
            event.stopPropagation();
            paramDiv.classList.remove('geode-block-slot-hover');
        });

        view.registerDomEvent(paramDiv, 'drop', (event: DragEvent) => {
            event.stopPropagation();
            if (scriptEditor.currentlyDraggedBlock === undefined) {
                return;
            }
            const shouldCopy = scriptEditor.currentlyDraggedBlockIsCopy;
            const droppedBlock = scriptEditor.currentlyDraggedBlock;
            const newInstance = shouldCopy ? AmethystFunctionHandler.Copy(droppedBlock.instance) : droppedBlock.instance;
            afei.instance.parameters[paramIndex] = newInstance;
            if (!(droppedBlock.parentEI === undefined || shouldCopy)) {
                const parentEI = droppedBlock.parentEI;
                parentEI.RemoveParameter(droppedBlock.instance);
                parentEI.DisplayBlock(view);
            }
            afei.DisplayBlock(view);
            event.preventDefault();
            scriptEditor.currentlyDraggedBlock = undefined;
        });
    }
}
