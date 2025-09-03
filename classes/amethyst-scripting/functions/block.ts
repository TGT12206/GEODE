import { AppAndProject } from "classes/project";
import { AmethystFunction } from "./function";
import { AmethystStruct } from "../structs/struct";
import { AmethystFunctionHandler } from "./function-handler";
import { AmethystStructHandler } from "../structs/struct-handler";

export abstract class AmethystBlock {
    anp: AppAndProject;
    instance: AmethystFunction;
    div: HTMLDivElement;
    parentEI: AmethystBlock | undefined;
    constructor(instance: AmethystFunction, blockDiv: HTMLDivElement, anp: AppAndProject) {
        this.instance = instance;
        this.div = blockDiv;
        this.anp = anp;
        this.DisplayBlock();
    }
    
    DisplayBlock(): void {
        this.div.empty();
        this.div.className = 'geode-script-block';
    }
    static AdjustDropdownWidth(input: HTMLInputElement | HTMLSelectElement, div: HTMLDivElement) {
        const tempEl = div.createEl('div', { text: input.value } );
        tempEl.className = 'geode-temporary-select-width-checker';
        input.style.width = tempEl.getBoundingClientRect().width + 'px';
        tempEl.remove();
    }
    CreateValOrFunctParameterDiv(index: number, paramDiv: HTMLDivElement): void | AmethystBlock {
        const param = this.instance.parameters[index];
        if (param instanceof AmethystStruct) {
            return this.CreateValParameterDiv(index, paramDiv);
        } else {
            return this.CreateFunctParameterDiv(index, paramDiv);
        }
    }
    CreateValParameterDiv(index: number, paramDiv: HTMLDivElement): void {
        AmethystBlock.SetParameterDiv(this.anp, this, paramDiv, index);
        const param = <AmethystStruct> this.instance.parameters[index];
        AmethystStructHandler.CreateEditor(param, paramDiv);
    }
    CreateFunctParameterDiv(index: number, paramDiv: HTMLDivElement): AmethystBlock {
        AmethystBlock.SetParameterDiv(this.anp, this, paramDiv, index);
        const param = <AmethystFunction> this.instance.parameters[index];
        const paramEI = AmethystFunctionHandler.CreateBlock(param, paramDiv, this.anp);
        paramEI.parentEI = this;
        if (paramEI.instance.type !== 'none') {
            AmethystBlock.MakeBlockDraggable(paramEI, this.anp, false);
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
    static MakeBlockDraggable(block: AmethystBlock, anp: AppAndProject, isCopy: boolean) {
        const scriptEditor = anp.project.scriptEditor;
        block.div.draggable = true;
        block.div.addEventListener("dragstart", (event: DragEvent) => {
            event.stopPropagation();
            if (event.dataTransfer !== null) {
                event.dataTransfer.effectAllowed = 'copy';
            }
            scriptEditor.currentlyDraggedBlockIsCopy = isCopy;
            scriptEditor.currentlyDraggedBlock = block;
            scriptEditor.blocksDiv.style.height = '90%';
            scriptEditor.delDiv.style.height = '10%';
        });

        block.div.addEventListener('dragend', (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
            scriptEditor.blocksDiv.style.height = '100%';
            scriptEditor.delDiv.style.height = '0%';
        });
    }
    protected static SetParameterDiv(anp: AppAndProject, afei: AmethystBlock, paramDiv: HTMLDivElement, paramIndex: number) {
        const scriptEditor = anp.project.scriptEditor;

        paramDiv.addEventListener('dragover', (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
            if (event.dataTransfer !== null) {
                event.dataTransfer.dropEffect = "copy";
            }
            paramDiv.style.borderStyle = 'solid';
            // paramDiv.style.borderColor = ACCENT_COLOR_1;
        });

        paramDiv.addEventListener('dragleave', (event: DragEvent) => {
            event.stopPropagation();
            paramDiv.style.borderStyle = '';
        });

        paramDiv.addEventListener('drop', (event: DragEvent) => {
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
                parentEI.DisplayBlock();
            }
            afei.DisplayBlock();
            event.preventDefault();
            scriptEditor.currentlyDraggedBlock = undefined;
        });
    }
}
