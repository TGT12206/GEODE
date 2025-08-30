import { AppAndProject } from "classes/project";
import { Scope } from "classes/scope";
import { ANumberI, AS, ASHandler, ASI, AStringI } from "classes/structs/struct";
import { GEOD3ObjectHandler } from "classes/tabs/geod3-object";

export enum AF {
    'none',
    'chain',
    'get',
    'set',
    'add'
}

export class AFHandler {
    static Copy(obj: AFI): AFI {
        const newParams = [];
        for (let i = 0; i < obj.parameters.length; i++) {
            const currParam = obj.parameters[i];
            if (currParam instanceof AFI) {
                newParams.push(this.Copy(currParam));
            } else {
                newParams.push(ASHandler.Copy(currParam));
            }
        }
        switch(obj.type) {
            case AF.none:
            default:
                return new ADoNothingI();
            case AF.chain:
                return new AChainI(<AFI[]> newParams);
            case AF.get:
                return new AGetI(<ASI[]> newParams);
            case AF.set:
                return new ASetI(newParams);
            case AF.add:
                return new AAddI(newParams);
        }
    }
    static CreateI(type: AF, parameters: (ASI | AFI)[] | undefined): AFI {
        switch(type) {
            case AF.none:
            default:
                return new ADoNothingI();
            case AF.chain:
                return new AChainI(<AFI[] | undefined> parameters);
            case AF.get:
                return new AGetI(<ASI[] | undefined> parameters);
            case AF.set:
                return new ASetI(parameters);
            case AF.add:
                return new AAddI(parameters);
        }
    }
    static CreateEI(obj: AFI, blockDiv: HTMLDivElement, anp: AppAndProject): AFEI {
        switch(obj.type) {
            case AF.none:
            default:
                return new ADoNothingEI(obj, blockDiv, anp);
            case AF.chain:
                return new AChainEI(obj, blockDiv, anp);
            case AF.get:
                return new AGetEI(obj, blockDiv, anp);
            case AF.set:
                return new ASetEI(obj, blockDiv, anp);
            case AF.add:
                return new AAddEI(obj, blockDiv, anp);
        }
    }
    static CreateRI(obj: AFI, anp: AppAndProject): AFRI {
        switch(obj.type) {
            case AF.none:
            default:
                return new ADoNothingRI(obj, anp);
            case AF.chain:
                return new AChainRI(obj, anp);
            case AF.get:
                return new AGetRI(obj, anp);
            case AF.set:
                return new ASetRI(obj, anp);
            case AF.add:
                return new AAddRI(obj, anp);
        }
    }
}

export abstract class AFI {
    type: AF;
    defaultParameters: (ASI | AFI)[];
    parameters: (ASI | AFI)[];
    constructor() {
        this.defaultParameters = [];
        this.parameters = [];
    }
}

export abstract class AFEI {
    anp: AppAndProject;
    instance: AFI;
    div: HTMLDivElement;
    parentEI: AFEI | undefined;
    constructor(instance: AFI, blockDiv: HTMLDivElement, anp: AppAndProject) {
        this.instance = instance;
        this.div = blockDiv;
        this.anp = anp;
        this.DisplayBlock();
    }
    abstract DisplayBlock(): void;
    RemoveParameter(parameter: AFI): void {
        for (let i = 0; i < this.instance.parameters.length; i++) {
            if (this.instance.parameters[i] === parameter) {
                const currDefaultParam = this.instance.defaultParameters[i];
                this.instance.parameters[i] = currDefaultParam instanceof ASI ? ASHandler.Copy(currDefaultParam) : AFHandler.Copy(currDefaultParam);
            }
        }
    }
    static MakeBlockDraggable(block: AFEI, anp: AppAndProject, isCopy: boolean) {
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
    protected static SetParameterDiv(anp: AppAndProject, afei: AFEI, paramDiv: HTMLDivElement, paramIndex: number) {
        const scriptEditor = anp.project.scriptEditor;

        paramDiv.addEventListener('dragover', (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
            if (event.dataTransfer !== null) {
                event.dataTransfer.dropEffect = "copy";
            }
            paramDiv.style.borderStyle = 'solid';
            paramDiv.style.borderColor = 'rgb(223, 236, 255)';
        });

        paramDiv.addEventListener('dragleave', (event: DragEvent) => {
            event.stopPropagation();
            paramDiv.style.borderStyle = '';
        });

        paramDiv.addEventListener('drop', (event: DragEvent) => {
            event.stopPropagation();
            if (scriptEditor.currentlyDraggedBlock !== undefined) {
                let newBlock;
                let newBlockDiv;
                if (scriptEditor.currentlyDraggedBlockIsCopy) {
                    const newBlockInstance = AFHandler.Copy(scriptEditor.currentlyDraggedBlock.instance);
                    newBlockDiv = <HTMLDivElement> scriptEditor.currentlyDraggedBlock.div.cloneNode(true);
                    newBlock = AFHandler.CreateEI(newBlockInstance, newBlockDiv, anp);
                } else {
                    if (scriptEditor.currentlyDraggedBlock.parentEI !== undefined) {
                        const parentEI = scriptEditor.currentlyDraggedBlock.parentEI;
                        parentEI.RemoveParameter(scriptEditor.currentlyDraggedBlock.instance);
                        parentEI.DisplayBlock();
                    }
                    newBlockDiv = scriptEditor.currentlyDraggedBlock.div;
                    newBlock = scriptEditor.currentlyDraggedBlock;
                    newBlockDiv.detach();
                }
                afei.instance.parameters[paramIndex] = newBlock.instance;
                afei.DisplayBlock();
                event.preventDefault();
            }
            scriptEditor.currentlyDraggedBlock = undefined;
        });
    }
}

export abstract class AFRI {
    type: AF;
    parameters: (ASI | AFRI)[];
    anp: AppAndProject;
    abstract Execute(): Promise<any>;
    constructor(ogFunction: AFI, anp: AppAndProject) {
        this.type = ogFunction.type;
        this.parameters = [];
        this.anp = anp;
        for (let i = 0; i < ogFunction.parameters.length; i++) {
            const ogParam = ogFunction.parameters[i];
            let copy;
            if (ogParam instanceof ASI) {
                copy = ASHandler.Copy(ogParam);
            } else {
                copy = AFHandler.CreateRI(ogParam, anp);
            }
            this.parameters.push(copy);
        }
    }
}

//#region Do Nothing
export class ADoNothingI extends AFI {
    type = AF.none;
}

export class ADoNothingEI extends AFEI {
    instance: ADoNothingI;
    override DisplayBlock(): void {
        this.div.style.minWidth = '4vh';
        this.div.style.minHeight = '4vh';
        this.div.style.backgroundColor = 'rgb(5, 5, 8)';
    }
    override RemoveParameter(parameter: AFI): void { }
}

export class ADoNothingRI extends AFRI {
    async Execute(): Promise<void> {}
}
//#endregion Do Nothing

//#region Chain
export class AChainI extends AFI {
    type = AF.chain;
    defaultParameters: AFI[];
    parameters: AFI[];
    constructor(parameters: (AFI)[] | undefined = undefined) {
        super();
        const doNothing = new ADoNothingI();
        this.defaultParameters.push(doNothing);
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AFHandler.Copy(doNothing));
        }
    }
}

export class AChainEI extends AFEI {
    instance: AChainI;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geod3-script-block vbox';
        div.style.backgroundColor = 'rgb(18, 18, 24)';
        div.style.borderStyle = 'solid';
        div.style.borderColor = 'rgb(100, 109, 123)';
        div.style.width = 'fit-content';
        div.style.padding = '1vh';
        div.style.gap = '1vh';
        const anp = this.anp;

        for (let i = 0; i < this.instance.parameters.length; i++) {
            const index = i;
            const currBlockDiv = div.createDiv('hbox');
            const currParamDiv = currBlockDiv.createDiv();
            const currParam = this.instance.parameters[i];
            
            const currParamEI = AFHandler.CreateEI(currParam, currParamDiv, anp);
            AFEI.MakeBlockDraggable(currParamEI, anp, false);
            currParamEI.parentEI = this;

            AFEI.SetParameterDiv(anp, this, currParamDiv, index);

            const deleteButton = currBlockDiv.createEl('button', { text: '-' } );
            deleteButton.className = 'geod3-remove-button';
            const addButton = currBlockDiv.createEl('button', { text: '+' } );
            addButton.className = 'geod3-add-button';

            deleteButton.onclick = () => {
                this.instance.parameters.splice(index, 1);
                this.DisplayBlock();
            }

            addButton.onclick = () => {
                this.instance.parameters.splice(index, 0, new ADoNothingI());
                this.DisplayBlock();
            }
        }
        const addButton = div.createEl('button', { text: '+' } );
        addButton.className = 'geod3-add-button';

        addButton.onclick = () => {
            this.instance.parameters.splice(this.instance.parameters.length, 0, new ADoNothingI());
            this.DisplayBlock();
        }
    }
    override RemoveParameter(parameter: AFI): void {
        for (let i = 0; i < this.instance.parameters.length; i++) {
            if (this.instance.parameters[i] === parameter) {
                this.instance.parameters[i] = AFHandler.Copy(this.instance.defaultParameters[0]);
            }
        }
    }
}

export class AChainRI extends AFRI {
    parameters: AFRI[];
    async Execute(): Promise<void> {
        for (let i = 0; i < this.parameters.length; i++) {
            await this.parameters[i].Execute();
        }
    }
}
//#endregion Chain

//#region Get
export class AGetI extends AFI {
    type = AF.get;
    parameters: ASI[];
    constructor(parameters: ASI[] | undefined) {
        super()
        const objIndex = new ANumberI(Scope.Value, 'Object Index');
        const varName = new AStringI(Scope.Value, 'Variable Name');
        objIndex.value = 0;
        varName.value = 'Sprite Path';
        this.defaultParameters = [varName, objIndex];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(ASHandler.Copy(varName));
            this.parameters.push(ASHandler.Copy(objIndex));
        }
    }
}

export class AGetEI extends AFEI {
    instance: AGetI;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geod3-script-block hbox';
        div.style.backgroundColor = 'rgb(78, 17, 131)';
        div.style.borderStyle = 'solid';
        div.style.borderColor = 'rgb(100, 109, 123)';
        const anp = this.anp;

        const varName = this.instance.parameters[0];
        const objID = this.instance.parameters[1];

        div.createEl('div', { text: 'Get' } );
        const varDiv = div.createDiv();
        div.createEl('div', { text: 'from' } );
        const objDiv = div.createDiv();

        const adjustInputWidth = (input: HTMLSelectElement) => {
            const tempEl = div.createEl('div', { text: input.value } );
            tempEl.style.position = 'absolute';
            tempEl.style.visibility = 'hidden';
            tempEl.style.whiteSpace = 'nowrap';
            tempEl.style.font = 'inherit';
            tempEl.style.padding = '1.75vh';
            input.style.width = tempEl.getBoundingClientRect().width + 'px';
            tempEl.remove();
        }

        const objIDInput = objDiv.createEl('select');
        const varNameInput = varDiv.createEl('select');

        objIDInput.style.backgroundColor = 'rgb(29, 0, 54)';
        varNameInput.style.backgroundColor = 'rgb(29, 0, 54)';

        const objArr = anp.project.sceneView.objects;
        for (let i = 0; i < objArr.length; i++) {
            objIDInput.createEl('option', { text: i + ': ' + objArr[i].name, value: i + ': ' + objArr[i].name } );
        }

        const GetAllVarNames = () => {
            varNameInput.empty();
            const objArr = anp.project.sceneView.objects;
            const varArr = objArr[this.instance.parameters[1].value].variables;
            for (let i = 0; i < varArr.length; i++) {
                varNameInput.createEl('option', { text: varArr[i].name, value: varArr[i].name } );
            }
        }
        
        objIDInput.onchange = () => {
            this.instance.parameters[1].value = parseInt(objIDInput.value.split(':')[0]);
            adjustInputWidth(objIDInput);
            GetAllVarNames();
        }
        varNameInput.onchange = () => {
            this.instance.parameters[0].value = varNameInput.value;
            adjustInputWidth(varNameInput);
        }

        GetAllVarNames();

        objIDInput.value = objID.value + ': ' + objArr[objID.value].name;
        varNameInput.value = varName.value;
        
        adjustInputWidth(objIDInput);
        adjustInputWidth(varNameInput);
    }
}

export class AGetRI extends AFRI {
    parameters: ASI[];
    async Execute(): Promise<ASI> {
        const varName = this.parameters[0];
        const objIndex = this.parameters[1];
        const obj = this.anp.project.gameView.objects[objIndex.value];
        return GEOD3ObjectHandler.GetVariable(obj, varName.value);
    }
}
//#endregion Get

//#region Set
export class ASetI extends AFI {
    type = AF.set;
    constructor(parameters: (ASI | AFI)[] | undefined) {
        super()
        const varName = new AStringI(Scope.Value, 'Variable Name');
        const objIndex = new ANumberI(Scope.Value, 'Object Index');
        varName.value = 'Sprite Path';
        objIndex.value = 0;
        this.defaultParameters = [varName, objIndex];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(ASHandler.Copy(varName));
            this.parameters.push(ASHandler.Copy(objIndex));
            this.parameters.push(ASHandler.CreateI(AS.number, Scope.Value, ''));
        }
    }
}

export class ASetEI extends AFEI {
    instance: ASetI;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geod3-script-block hbox';
        div.style.backgroundColor = 'rgb(78, 17, 131)';
        div.style.borderStyle = 'solid';
        div.style.borderColor = 'rgb(100, 109, 123)';
        const anp = this.anp;

        const varName = <ASI> this.instance.parameters[0];
        const objID = <ASI> this.instance.parameters[1];

        div.createEl('div', { text: 'Set' } );
        const varDiv = div.createDiv();
        div.createEl('div', { text: 'from' } );
        const objDiv = div.createDiv();
        div.createEl('div', { text: 'to' } );
        const valueDiv = div.createDiv();

        AFEI.SetParameterDiv(anp, this, valueDiv, 2);

        const adjustInputWidth = (input: HTMLSelectElement) => {
            const tempEl = div.createEl('div', { text: input.value } );
            tempEl.style.position = 'absolute';
            tempEl.style.visibility = 'hidden';
            tempEl.style.whiteSpace = 'nowrap';
            tempEl.style.font = 'inherit';
            tempEl.style.padding = '1.75vh';
            input.style.width = tempEl.getBoundingClientRect().width + 'px';
            tempEl.remove();
        }

        const objIDInput = objDiv.createEl('select');
        const varNameInput = varDiv.createEl('select');

        objIDInput.style.backgroundColor = 'rgb(29, 0, 54)';
        varNameInput.style.backgroundColor = 'rgb(29, 0, 54)';

        const objArr = anp.project.sceneView.objects;
        for (let i = 0; i < objArr.length; i++) {
            objIDInput.createEl('option', { text: i + ': ' + objArr[i].name, value: i + ': ' + objArr[i].name } );
        }

        const GetAllVarNames = () => {
            varNameInput.empty();
            const objArr = anp.project.sceneView.objects;
            const varArr = objArr[(<ASI> this.instance.parameters[1]).value].variables;
            for (let i = 0; i < varArr.length; i++) {
                varNameInput.createEl('option', { text: varArr[i].name, value: varArr[i].name } );
            }

            if (this.instance.parameters[2] instanceof AFI) {
                const valBlock = AFHandler.CreateEI(this.instance.parameters[2], valueDiv, anp);
                valBlock.parentEI = this;
                AFEI.MakeBlockDraggable(valBlock, anp, false);
            } else {
                valueDiv.empty();
                const varName = <ASI> this.instance.parameters[0];
                const objIndex = <ASI> this.instance.parameters[1];
                const obj = this.anp.project.sceneView.objects[objIndex.value];
                const value = ASHandler.Copy(GEOD3ObjectHandler.GetVariable(obj, varName.value));
                value.value = this.instance.parameters[2].value;
                ASHandler.CreateII(value, valueDiv);
                this.instance.parameters[2] = value;
            }
        }
        
        objIDInput.onchange = () => {
            (<ASI> this.instance.parameters[1]).value = parseInt(objIDInput.value.split(':')[0]);
            adjustInputWidth(objIDInput);
            GetAllVarNames();
        }
        varNameInput.onchange = () => {
            (<ASI> this.instance.parameters[0]).value = varNameInput.value;
            adjustInputWidth(varNameInput);
        }

        GetAllVarNames();

        objIDInput.value = objID.value + ': ' + objArr[objID.value].name;
        varNameInput.value = varName.value;

        adjustInputWidth(objIDInput);
        adjustInputWidth(varNameInput);
    }
    override RemoveParameter(parameter: AFI): void {
        if (this.instance.parameters[2] === parameter) {
            const defaultParam = ASHandler.CreateI((<ASI> this.instance.parameters[0]).type, Scope.Value, '');
            this.instance.parameters[2] = defaultParam;
        }
    }
}

export class ASetRI extends AFRI {
    async Execute(): Promise<void> {
        const varName = <ASI> this.parameters[0];
        const objIndex = <ASI> this.parameters[1];
        const val = this.parameters[2];
        const obj = this.anp.project.gameView.objects[objIndex.value];
        const varToSet = GEOD3ObjectHandler.GetVariable(obj, varName.value);
        varToSet.value = val instanceof AFRI ? (await val.Execute()).value : val.value;
    }
}
//#endregion Set

//#region Add
export class AAddI extends AFI {
    type = AF.add;
    returnType = AS.number;
    constructor(parameters: (ASI | AFI)[] | undefined) {
        super()
        const num1 = new ANumberI(Scope.Value, 'num1');
        const num2 = new ANumberI(Scope.Value, 'num2');
        num1.value = 0;
        num2.value = 0;
        this.defaultParameters = [num1, num2];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(ASHandler.Copy(num1));
            this.parameters.push(ASHandler.Copy(num2));
        }
    }
}

export class AAddEI extends AFEI {
    instance: AAddI;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geod3-script-block hbox';
        div.style.backgroundColor = 'rgb(111, 46, 169)';
        div.style.borderStyle = 'solid';
        div.style.borderColor = 'rgb(100, 109, 123)';
        const anp = this.anp;

        const num1 = this.instance.parameters[0];
        const num2 = this.instance.parameters[1];

        const num1Div = div.createDiv();
        div.createEl('div', { text: '+' } );
        const num2Div = div.createDiv();

        AFEI.SetParameterDiv(anp, this, num1Div, 0);
        AFEI.SetParameterDiv(anp, this, num2Div, 1);

        const adjustInputWidth = (input: HTMLInputElement) => {
            const tempEl = div.createEl('div', { text: input.value } );
            tempEl.style.position = 'absolute';
            tempEl.style.visibility = 'hidden';
            tempEl.style.whiteSpace = 'nowrap';
            tempEl.style.font = 'inherit';
            tempEl.style.padding = '10px';
            input.style.width = tempEl.getBoundingClientRect().width + 'px';
            tempEl.remove();
        }

        if (num1 instanceof ASI) {
            const num1Input = num1Div.createEl('input', { type: 'text', value: num1.value + '' } );
            num1Input.style.background = 'rgb(29, 0, 54)';
            num1Input.style.padding = '1vh';
            adjustInputWidth(num1Input);
            num1Input.oninput = () => {
                adjustInputWidth(num1Input);
            }
            num1Input.onchange = () => {
                (<ASI> this.instance.parameters[0]).value = parseFloat(num1Input.value);
            }
        } else {
            const num1EI = AFHandler.CreateEI(num1, num1Div, anp);
            AFEI.MakeBlockDraggable(num1EI, anp, false);
            num1EI.parentEI = this;
        }
        if (num2 instanceof ASI) {
            const num2Input = num2Div.createEl('input', { type: 'text', value: num2.value + '' } );
            num2Input.style.background = 'rgb(29, 0, 54)';
            num2Input.style.padding = '1vh';
            adjustInputWidth(num2Input);
            num2Input.oninput = () => {
                adjustInputWidth(num2Input);
            }
            num2Input.onchange = () => {
                (<ASI> this.instance.parameters[1]).value = parseFloat(num2Input.value);
            }
        } else {
            const num2EI = AFHandler.CreateEI(num2, num2Div, anp);
            AFEI.MakeBlockDraggable(num2EI, anp, false);
            num2EI.parentEI = this;
        }
    }
}

export class AAddRI extends AFRI {
    async Execute(): Promise<ANumberI> {
        const param1 = this.parameters[0];
        const param2 = this.parameters[1];

        const param1IsAFRI = param1 instanceof AFRI;
        const param2IsAFRI = param2 instanceof AFRI;

        const num1 = param1IsAFRI ? (await param1.Execute()).value : param1.value;
        const num2 = param2IsAFRI ? (await param2.Execute()).value : param2.value;

        const output = new ANumberI(Scope.Value, 'sum');
        output.value = num1 + num2;

        return output;
    }
}
//#endregion Add

