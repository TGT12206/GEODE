import { AppAndProject } from "classes/project";
import { Scope } from "classes/scope";
import { ABooleanI, ANumberI, AS, ASHandler, ASI, AStringI } from "classes/structs/struct";
import { GEOD3ObjectHandler } from "classes/tabs/geod3-object";
import { BG_COLOR_1, BG_COLOR_2, BG_COLOR_3, ACCENT_COLOR_1, ACCENT_COLOR_2, ACCENT_COLOR_3, CENTRAL_COLOR_1, CENTRAL_COLOR_2, CENTRAL_COLOR_3, REMOVE_COLOR_1, REMOVE_COLOR_2 } from "colors";

export enum AF {
    'none',
    'chain',
    'get',
    'set',
    'if',
    'equals',
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
            case AF.if:
                return new AIfI(newParams);
            case AF.equals:
                return new AEqualsI(newParams);
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
            case AF.if:
                return new AIfI(parameters);
            case AF.equals:
                return new AEqualsI(parameters);
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
            case AF.if:
                return new AIfEI(obj, blockDiv, anp);
            case AF.equals:
                return new AEqualsEI(obj, blockDiv, anp);
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
            case AF.if:
                return new AIfRI(obj, anp);
            case AF.equals:
                return new AEqualsRI(obj, anp);
            case AF.add:
                return new AAddRI(obj, anp);
        }
    }
}

//#region Abstract Classes
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
    static AdjustInputWidth(input: HTMLInputElement | HTMLSelectElement, div: HTMLDivElement) {
        const tempEl = div.createEl('div', { text: input.value } );
        tempEl.style.position = 'absolute';
        tempEl.style.visibility = 'hidden';
        tempEl.style.whiteSpace = 'nowrap';
        tempEl.style.font = 'inherit';
        tempEl.style.padding = input instanceof HTMLInputElement ? '1vh' : '2vh';
        input.style.width = tempEl.getBoundingClientRect().width + 'px';
        tempEl.remove();
    }
    CreateASIOrAFIParameterDiv(index: number, paramDiv: HTMLDivElement, backgroundColor: string): void | AFEI {
        const param = this.instance.parameters[index];
        if (param instanceof ASI) {
            return this.CreateASIParameterDiv(index, paramDiv, backgroundColor);
        } else {
            return this.CreateAFIParameterDiv(index, paramDiv, backgroundColor);
        }
    }
    CreateASIParameterDiv(index: number, paramDiv: HTMLDivElement, backgroundColor: string): void {
        const param = <ASI> this.instance.parameters[index];
        ASHandler.CreateII(param, paramDiv, backgroundColor);
    }
    CreateAFIParameterDiv(index: number, paramDiv: HTMLDivElement, backgroundColor: string): AFEI {
        const param = <AFI> this.instance.parameters[index];
        const paramEI = AFHandler.CreateEI(param, paramDiv, this.anp);
        AFEI.MakeBlockDraggable(paramEI, this.anp, false);
        paramEI.parentEI = this;
        if (paramEI.instance.type === AF.none) {
            paramEI.div.style.backgroundColor = backgroundColor;
        }
        return paramEI;
    }
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
            paramDiv.style.borderColor = ACCENT_COLOR_1;
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
//#endregion Abstract Classes

//#region Do Nothing
export class ADoNothingI extends AFI {
    type = AF.none;
}

export class ADoNothingEI extends AFEI {
    instance: ADoNothingI;
    override DisplayBlock(): void {
        this.div.style.borderRadius = '0.5vh';
        this.div.style.minWidth = '4vh';
        this.div.style.minHeight = '4vh';
        this.div.style.backgroundColor = BG_COLOR_3;
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
        div.style.backgroundColor = BG_COLOR_2;
        div.style.borderStyle = 'solid';
        div.style.borderColor = ACCENT_COLOR_3;
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
        div.style.backgroundColor = CENTRAL_COLOR_2;
        div.style.borderStyle = 'solid';
        div.style.borderColor = ACCENT_COLOR_3;
        const anp = this.anp;

        const varName = this.instance.parameters[0];
        const objID = this.instance.parameters[1];

        div.createEl('div', { text: 'Get' } );
        const varDiv = div.createDiv();
        div.createEl('div', { text: 'from' } );
        const objDiv = div.createDiv();

        const objIDInput = objDiv.createEl('select');
        const varNameInput = varDiv.createEl('select');

        objIDInput.style.backgroundColor = CENTRAL_COLOR_3;
        varNameInput.style.backgroundColor = CENTRAL_COLOR_3;

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
            AFEI.AdjustInputWidth(objIDInput, div);
            GetAllVarNames();
        }
        varNameInput.onchange = () => {
            this.instance.parameters[0].value = varNameInput.value;
            AFEI.AdjustInputWidth(varNameInput, div);
        }

        GetAllVarNames();

        objIDInput.value = objID.value + ': ' + objArr[objID.value].name;
        varNameInput.value = varName.value;
        
        AFEI.AdjustInputWidth(objIDInput, div);
        AFEI.AdjustInputWidth(varNameInput, div);
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
        div.style.backgroundColor = CENTRAL_COLOR_2;
        div.style.borderStyle = 'solid';
        div.style.borderColor = ACCENT_COLOR_3;
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

        const objIDInput = objDiv.createEl('select');
        const varNameInput = varDiv.createEl('select');

        objIDInput.style.backgroundColor = CENTRAL_COLOR_3;
        varNameInput.style.backgroundColor = CENTRAL_COLOR_3;

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

            valueDiv.empty();
            if (this.instance.parameters[2] instanceof AFI) {
                this.CreateAFIParameterDiv(2, valueDiv, CENTRAL_COLOR_3);
            } else {
                this.CreateASIParameterDiv(2, valueDiv, CENTRAL_COLOR_3);
            }
        }
        
        objIDInput.onchange = () => {
            (<ASI> this.instance.parameters[1]).value = parseInt(objIDInput.value.split(':')[0]);
            AFEI.AdjustInputWidth(objIDInput, div);
            GetAllVarNames();
        }
        varNameInput.onchange = () => {
            (<ASI> this.instance.parameters[0]).value = varNameInput.value;
            AFEI.AdjustInputWidth(varNameInput, div);
        }

        GetAllVarNames();

        objIDInput.value = objID.value + ': ' + objArr[objID.value].name;
        varNameInput.value = varName.value;

        AFEI.AdjustInputWidth(objIDInput, div);
        AFEI.AdjustInputWidth(varNameInput, div);
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

//#region If
export class AIfI extends AFI {
    type = AF.if;
    constructor(parameters: (ASI | AFI)[] | undefined) {
        super()
        const condition = new ABooleanI(Scope.Value, 'condition');
        const doNothing = new ADoNothingI();
        condition.value = false;
        this.defaultParameters = [condition, doNothing];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(ASHandler.Copy(condition));
            this.parameters.push(AFHandler.Copy(doNothing));
        }
    }
}

export class AIfEI extends AFEI {
    instance: AIfI;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geod3-script-block vbox';
        div.style.backgroundColor = ACCENT_COLOR_2;
        div.style.borderStyle = 'solid';
        div.style.borderColor = ACCENT_COLOR_3;
        const anp = this.anp;

        const topDiv = div.createDiv('hbox');
        topDiv.createEl('div', { text: 'If' } );
        const conditionDiv = topDiv.createDiv();
        const functionDiv = div.createDiv();

        AFEI.SetParameterDiv(anp, this, conditionDiv, 0);
        AFEI.SetParameterDiv(anp, this, functionDiv, 1);

        this.CreateASIOrAFIParameterDiv(0, conditionDiv, ACCENT_COLOR_3);
        this.CreateAFIParameterDiv(1, functionDiv, ACCENT_COLOR_3);
    }
}

export class AIfRI extends AFRI {
    async Execute(): Promise<void> {
        const param1 = this.parameters[0];

        const param1IsAFRI = param1 instanceof AFRI;

        const condition = param1IsAFRI ? (await param1.Execute()).value : param1.value;

        if (condition) {
            const param2 = <AFRI> this.parameters[1];
            await param2.Execute();
        }
    }
}
//#endregion If

//#region Equals
export class AEqualsI extends AFI {
    type = AF.equals;
    constructor(parameters: (ASI | AFI)[] | undefined) {
        super()
        const val1 = new ANumberI(Scope.Value, 'val1');
        const val2 = new ANumberI(Scope.Value, 'val2');
        val1.value = 0;
        val2.value = 0;
        this.defaultParameters = [val1, val2];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(ASHandler.Copy(val1));
            this.parameters.push(ASHandler.Copy(val2));
        }
    }
}

export class AEqualsEI extends AFEI {
    instance: AEqualsI;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geod3-script-block hbox';
        div.style.backgroundColor = CENTRAL_COLOR_1;
        div.style.borderStyle = 'solid';
        div.style.borderColor = ACCENT_COLOR_3;
        const anp = this.anp;

        const val1Div = div.createDiv();
        div.createEl('div', { text: '=' } );
        const val2Div = div.createDiv();

        AFEI.SetParameterDiv(anp, this, val1Div, 0);
        AFEI.SetParameterDiv(anp, this, val2Div, 1);

        this.CreateASIOrAFIParameterDiv(0, val1Div, CENTRAL_COLOR_3);
        this.CreateASIOrAFIParameterDiv(1, val2Div, CENTRAL_COLOR_3);
    }
}

export class AEqualsRI extends AFRI {
    async Execute(): Promise<ABooleanI> {
        const param1 = this.parameters[0];
        const param2 = this.parameters[1];

        const param1IsAFRI = param1 instanceof AFRI;
        const param2IsAFRI = param2 instanceof AFRI;

        const val1 = param1IsAFRI ? (await param1.Execute()).value : param1.value;
        const val2 = param2IsAFRI ? (await param2.Execute()).value : param2.value;

        const output = new ABooleanI(Scope.Value, 'sum');
        output.value = val1 === val2;

        return output;
    }
}
//#endregion Equals

//#region Add
export class AAddI extends AFI {
    type = AF.add;
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
        div.style.backgroundColor = CENTRAL_COLOR_1;
        div.style.borderStyle = 'solid';
        div.style.borderColor = ACCENT_COLOR_3;
        const anp = this.anp;

        const num1Div = div.createDiv();
        div.createEl('div', { text: '+' } );
        const num2Div = div.createDiv();

        AFEI.SetParameterDiv(anp, this, num1Div, 0);
        AFEI.SetParameterDiv(anp, this, num2Div, 1);

        this.CreateASIOrAFIParameterDiv(0, num1Div, CENTRAL_COLOR_3);
        this.CreateASIOrAFIParameterDiv(1, num2Div, CENTRAL_COLOR_3);
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
