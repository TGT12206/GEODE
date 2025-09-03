import { Tab } from "./tab";
import { GEODEObject } from "../geode-objects/geode-object";
import { AmethystFunction } from "classes/amethyst-scripting/functions/function";
import { AmethystBlock } from "classes/amethyst-scripting/functions/block";
import { AmethystFunctionHandler } from "classes/amethyst-scripting/functions/function-handler";

export class ScriptEditor extends Tab {
    static override icon = '📜';
    scriptDiv: HTMLDivElement;
    blocksDiv: HTMLDivElement;
    delDiv: HTMLDivElement;
    currentObject: GEODEObject;
    currentlyDraggedBlock: AmethystBlock | undefined;
    currentlyDraggedBlockIsCopy: boolean;

    override async Focus(div: HTMLDivElement): Promise<void> {
        div.empty();

        const objs = this.anp.project.sceneView.objects;
        if (this.currentObject === undefined) {
            if (objs.length > 0) {
                this.currentObject = objs[0];
            } else {
                div.createEl('h1', { text: 'Create Objects in the Scene View first!' } );
                return;
            }
        }

        div.className = 'geode-tab-container hbox';
        const leftSide = div.createDiv('geode-script-wrapper vbox');
        const topDiv = leftSide.createDiv('geode-script-navigator hbox');

        const objIDInput = topDiv.createEl('select');
        const clusterTypeInput = topDiv.createEl('select');
        const clusterNumberInput = topDiv.createEl('input', { type: 'number', value: '0' } );
        
        for (let i = 0; i < objs.length; i++) {
            const currObj = objs[i];
            objIDInput.createEl('option', { text: currObj.idInScene + ': ' + currObj.name, value: i + '' } );
        }
        objIDInput.value = this.currentObject.idInScene + '';

        clusterTypeInput.createEl('option', { text: 'On Start', value: 'On Start' } );
        clusterTypeInput.createEl('option', { text: 'On New Frame', value: 'On New Frame' } );
        clusterTypeInput.value = 'On Start';
        
        clusterNumberInput.min = '0';

        this.scriptDiv = leftSide.createDiv('geode-script');
        const blockPool = div.createDiv('geode-block-pool');
        this.blocksDiv = blockPool.createDiv('geode-blocks-list vbox');
        this.delDiv = blockPool.createDiv('geode-block-delete-div');

        const LoadScript = () => {
            this.scriptDiv.empty();
            const obj = this.currentObject;
            const scriptType = clusterTypeInput.value === 'On Start' ? obj.onStart : obj.onNewFrame;
            const index = parseInt(clusterNumberInput.value);

            if (index >= scriptType.length) {
                const doNothing = AmethystFunctionHandler.Create('none');
                const chain = AmethystFunctionHandler.Create('chain', [doNothing]);
                scriptType.push(chain);
                clusterNumberInput.max = scriptType.length + '';
            }
            AmethystFunctionHandler.CreateBlock(scriptType[index], this.scriptDiv.createDiv(), this.anp);
        }
        this.CreateBlockPool();
        LoadScript();
        
        objIDInput.onchange = () => {
            this.currentObject = objs[parseInt(objIDInput.value)];
            const obj = this.currentObject;
            const scriptType = clusterTypeInput.value === 'On Start' ? obj.onStart : obj.onNewFrame;
            clusterNumberInput.value = '0';
            clusterNumberInput.max = scriptType.length + '';
            LoadScript();
        }
        clusterTypeInput.onchange = () => {
            const obj = this.currentObject;
            const scriptType = clusterTypeInput.value === 'On Start' ? obj.onStart : obj.onNewFrame;
            clusterNumberInput.value = '0';
            clusterNumberInput.max = scriptType.length + '';
            LoadScript();
        }
        clusterNumberInput.onchange = () => {
            LoadScript();
        }
    }

    private CreateBlockPool() {
        this.blocksDiv.empty();

        this.delDiv.addEventListener('dragover', (event: DragEvent) => {
            event.preventDefault();
            if (event.dataTransfer !== null) {
                event.dataTransfer.dropEffect = "copy";
            }
            this.delDiv.className = 'geode-block-delete-div-hover';
        });

        this.delDiv.addEventListener("dragleave", (event: DragEvent) => {
            event.stopPropagation();
            this.delDiv.className = 'geode-block-delete-div';
        });

        this.delDiv.addEventListener('drop', (event: DragEvent) => {
            if (!(this.currentlyDraggedBlock === undefined || this.currentlyDraggedBlockIsCopy)) {
                this.currentlyDraggedBlock.div.remove();
                const parentEI = this.currentlyDraggedBlock.parentEI;
                if (parentEI !== undefined) {
                    parentEI.RemoveParameter(this.currentlyDraggedBlock.instance);
                    parentEI.DisplayBlock();
                }
            }
        });
        
        const knownTypes = AmethystFunction.knownTypes;
        const anp = this.anp;
        for (let i = 1; i < knownTypes.length; i++) {
            const instance = AmethystFunctionHandler.Create(knownTypes[i]);
            const block = AmethystFunctionHandler.CreateBlock(instance, this.blocksDiv.createDiv(), anp);
            AmethystBlock.MakeBlockDraggable(block, anp, true);
        }
    }


    override UnFocus(div: HTMLDivElement): void | Promise<void> {
        div.empty();
    }
}