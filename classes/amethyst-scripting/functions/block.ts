import { AmethystFunction } from "./function";
import { AmethystStruct, varType } from "../structs/struct";
import { AmethystFunctionHandler } from "./function-handler";
import { AmethystStructHandler } from "../structs/struct-handler";
import { Project } from "classes/project";
import { GEODEView } from "classes/geode-view";

export abstract class AmethystBlock {
    project: Project;
    instance: AmethystFunction;
    div: HTMLDivElement;
    parentEI: AmethystBlock | undefined;
    isRightType: boolean;
    constructor(instance: AmethystFunction, blockDiv: HTMLDivElement, view: GEODEView, project: Project, isRightType: boolean) {
        this.instance = instance;
        this.div = blockDiv;
        this.project = project;
        this.isRightType = isRightType;
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

    /**
     * Call this function if you are unsure whether your current parameter is a value or a function
     * @param enforcedType what type must fill this slot? If the parameter doesn't match this type, it will be outlined in red if it is a function, or replaced if it is a value. Leave this field blank if there is no type requirement for this parameter.
     */
    DisplaySlot(index: number, paramDiv: HTMLDivElement, view: GEODEView, enforcedType: varType | undefined = undefined): void | AmethystBlock {
        const param = this.instance.parameters[index];
        if (param instanceof AmethystStruct) {
            return this.DisplayValueSlot(index, paramDiv, view, enforcedType);
        } else {
            return this.DisplayFunctionSlot(index, paramDiv, view, enforcedType);
        }
    }

    /**
     * Call this function if you are sure your current parameter is a value
     * @param enforcedType what type must fill this slot? If the parameter doesn't match this type, it will be replaced with a default value. Leave this field blank if there is no type requirement for this parameter.
     */
    DisplayValueSlot(index: number, paramDiv: HTMLDivElement, view: GEODEView, enforcedType: varType | undefined = undefined): void {
        if (enforcedType !== undefined) {
            const currValParam = this.instance.parameters[index];
            
            if (enforcedType !== currValParam.type) {
                const defaultVal = AmethystStructHandler.Create(enforcedType);
                this.instance.parameters[index] = defaultVal;
            }
        }
        AmethystBlock.SetSlot(view, this.project, this, paramDiv, index, enforcedType);
        const param = <AmethystStruct> this.instance.parameters[index];
        const valInput = AmethystStructHandler.CreateEditor(param, paramDiv, view);
    }

    /**
     * Call this function if you are sure your current parameter is a function
     * @param enforcedType what type must fill this slot? If the parameter doesn't match this type, it will be outlined in red. Leave this field blank if there is no type requirement for this parameter.
     */
    DisplayFunctionSlot(index: number, paramDiv: HTMLDivElement, view: GEODEView, enforcedType: varType | undefined = undefined): AmethystBlock {
        AmethystBlock.SetSlot(view, this.project, this, paramDiv, index, enforcedType);
        const param = <AmethystFunction> this.instance.parameters[index];
        const paramReturnType = param.GetReturnType(this.project);
        const isCorrectType = enforcedType === undefined ? true : enforcedType === paramReturnType;
        const paramEI = AmethystFunctionHandler.CreateBlock(param, paramDiv, view, this.project, isCorrectType);
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
                event.dataTransfer.setData('text/plain', 'copy');
                event.dataTransfer.effectAllowed = 'copy';
            }
            scriptEditor.currentlyDraggedBlockIsCopy = isCopy;
            scriptEditor.currentlyDraggedBlock = block;
        });

        view.registerDomEvent(block.div, 'dragend', (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
        });
    }

    protected static SetSlot(view: GEODEView, project: Project, afei: AmethystBlock, paramDiv: HTMLDivElement, paramIndex: number, typeToEnforce: varType | undefined = undefined) {
        const scriptEditor = project.scriptEditor;

        view.registerDomEvent(paramDiv, 'dragover', (event: DragEvent) => {
            event.stopPropagation();
            if (!(typeToEnforce === undefined || project.scriptEditor.currentlyDraggedBlock?.instance.GetReturnType(project) === typeToEnforce)) {
                return;
            }
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
            if (!(typeToEnforce === undefined || scriptEditor.currentlyDraggedBlock.instance.GetReturnType(project) === typeToEnforce)) {
                return;
            }
            console.log('a');
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
