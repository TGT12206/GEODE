import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBlock } from "../block";
import { SetVariable } from "./set-variable";
import { AmethystFunction } from "../function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { GEODEObjectHandler } from "classes/geode-objects/geode-object-handler";

export class SetVariableBlock extends AmethystBlock {
    instance: SetVariable;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-set-variable-block';
        const anp = this.anp;

        const varName = <AmethystStruct> this.instance.parameters[0];
        const objID = <AmethystStruct> this.instance.parameters[1];

        div.createEl('div', { text: 'Set' } );
        const varDiv = div.createDiv();
        div.createEl('div', { text: 'from' } );
        const objDiv = div.createDiv();
        div.createEl('div', { text: 'to' } );
        const valueDiv = div.createDiv();

        const objIDInput = objDiv.createEl('select');
        const varNameInput = varDiv.createEl('select');

        const objArr = anp.project.sceneView.objects;
        for (let i = 0; i < objArr.length; i++) {
            objIDInput.createEl('option', { text: i + ': ' + objArr[i].name, value: i + ': ' + objArr[i].name } );
        }

        const CreateOrCheckValueInput = () => {
            valueDiv.empty();

            const objArr = anp.project.sceneView.objects;
            const objID = (<AmethystStruct> this.instance.parameters[1]).value;
            const currObj = objArr[objID];
            const variable = GEODEObjectHandler.GetVariable(currObj, varNameInput.value);

            if (this.instance.parameters.length === 2) {
                const defaultVal = AmethystStructHandler.Create(variable.type);
                this.instance.parameters.push(defaultVal);
                this.CreateValParameterDiv(2, valueDiv);
                return;
            }
            
            const currValParam = this.instance.parameters[2];
            if (currValParam instanceof AmethystFunction) {
                this.CreateFunctParameterDiv(2, valueDiv);
                return;
            }
            if (variable.type === currValParam.type) {
                return;
            }

            const defaultVal = AmethystStructHandler.Create(variable.type);
            this.instance.parameters[2] = defaultVal;
            this.CreateValParameterDiv(2, valueDiv);
        }

        const GetAllVarNames = () => {
            varNameInput.empty();

            const objArr = anp.project.sceneView.objects;
            const objID = (<AmethystStruct> this.instance.parameters[1]).value;
            const currObj = objArr[objID];
            const varArr = currObj.variables;

            for (let i = 0; i < varArr.length; i++) {
                varNameInput.createEl('option', { text: varArr[i].name, value: varArr[i].name } );
            }

            CreateOrCheckValueInput();
        }
        
        objIDInput.onchange = () => {
            (<AmethystStruct> this.instance.parameters[1]).value = parseInt(objIDInput.value.split(':')[0]);
            AmethystBlock.AdjustDropdownWidth(objIDInput, div);
            GetAllVarNames();
        }
        varNameInput.onchange = () => {
            (<AmethystStruct> this.instance.parameters[0]).value = varNameInput.value;
            AmethystBlock.AdjustDropdownWidth(varNameInput, div);
            CreateOrCheckValueInput();
        }

        GetAllVarNames();

        objIDInput.value = objID.value + ': ' + objArr[objID.value].name;
        varNameInput.value = varName.value;

        AmethystBlock.AdjustDropdownWidth(objIDInput, div);
        AmethystBlock.AdjustDropdownWidth(varNameInput, div);
    }
    override RemoveParameter(parameter: AmethystFunction): void {
        if (this.instance.parameters[2] === parameter) {
            const varName = (<AmethystStruct> this.instance.parameters[0]).value;
            const objID = (<AmethystStruct> this.instance.parameters[1]).value;
            const objs = this.anp.project.sceneView.objects;
            const variable = GEODEObjectHandler.GetVariable(objs[objID], varName);

            const defaultParam = AmethystStructHandler.Create(variable.type, undefined, '');
            this.instance.parameters[2] = defaultParam;
        }
    }
}
