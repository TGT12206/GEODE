import { Tab } from "./tab";
import { GEOD3Object } from "./geod3-object";
import { AChainI, ADoNothingI, AF, AFEI, AFHandler } from "classes/functions/function";

export class ScriptEditor extends Tab {
    static override icon = '📜';
    scriptDiv: HTMLDivElement;
    blocksDiv: HTMLDivElement;
    delDiv: HTMLDivElement;
    currentObject: GEOD3Object;
    currentlyDraggedBlock: AFEI | undefined;
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

        div.className = 'geod3-tab-container hbox';
        const leftSide = div.createDiv('geod3-script-wrapper vbox');
        const topDiv = leftSide.createDiv('geod3-script-navigator hbox');

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

        this.scriptDiv = leftSide.createDiv('geod3-script');
        const blockPool = div.createDiv('geod3-block-pool');
        this.blocksDiv = blockPool.createDiv('geod3-blocks-list vbox');
        this.delDiv = blockPool.createDiv('geod3-block-delete-div');

        const LoadScript = () => {
            this.scriptDiv.empty();
            const obj = this.currentObject;
            const scriptType = clusterTypeInput.value === 'On Start' ? obj.onStart : obj.onNewFrame;
            const index = parseInt(clusterNumberInput.value);

            if (index >= scriptType.length) {
                scriptType.push(new AChainI([new ADoNothingI()]));
                clusterNumberInput.max = scriptType.length + '';
            }
            AFHandler.CreateEI(scriptType[index], this.scriptDiv.createDiv(), this.anp);
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
            this.delDiv.className = 'geod3-block-delete-div-hover';
        });

        this.delDiv.addEventListener("dragleave", (event: DragEvent) => {
            event.stopPropagation();
            this.delDiv.className = 'geod3-block-delete-div';
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
        
        const chainI = AFHandler.CreateI(AF.chain, undefined);
        const getI = AFHandler.CreateI(AF.get, undefined);
        const setI = AFHandler.CreateI(AF.set, undefined);
        const ifI = AFHandler.CreateI(AF.if, undefined);
        const ifElseI = AFHandler.CreateI(AF.ifelse, undefined);
        const compareI = AFHandler.CreateI(AF.compare, undefined);
        const keydownI = AFHandler.CreateI(AF.keydown, undefined);
        const addI = AFHandler.CreateI(AF.add, undefined);

        const chainBlock = AFHandler.CreateEI(chainI, this.blocksDiv.createDiv('geod3-script-block'), this.anp);
        const getBlock = AFHandler.CreateEI(getI, this.blocksDiv.createDiv('geod3-script-block'), this.anp);
        const setBlock = AFHandler.CreateEI(setI, this.blocksDiv.createDiv('geod3-script-block'), this.anp);
        const ifBlock = AFHandler.CreateEI(ifI, this.blocksDiv.createDiv('geod3-script-block'), this.anp);
        const ifElseBlock = AFHandler.CreateEI(ifElseI, this.blocksDiv.createDiv('geod3-script-block'), this.anp);
        const compareBlock = AFHandler.CreateEI(compareI, this.blocksDiv.createDiv('geod3-script-block'), this.anp);
        const keydownBlock = AFHandler.CreateEI(keydownI, this.blocksDiv.createDiv('geod3-script-block'), this.anp);
        const addBlock = AFHandler.CreateEI(addI, this.blocksDiv.createDiv('geod3-script-block'), this.anp);

        AFEI.MakeBlockDraggable(chainBlock, this.anp, true);
        AFEI.MakeBlockDraggable(getBlock, this.anp, true);
        AFEI.MakeBlockDraggable(setBlock, this.anp, true);
        AFEI.MakeBlockDraggable(ifBlock, this.anp, true);
        AFEI.MakeBlockDraggable(ifElseBlock, this.anp, true);
        AFEI.MakeBlockDraggable(compareBlock, this.anp, true);
        AFEI.MakeBlockDraggable(keydownBlock, this.anp, true);
        AFEI.MakeBlockDraggable(addBlock, this.anp, true);
    }


    override UnFocus(div: HTMLDivElement): void | Promise<void> {
        div.empty();
    }
}