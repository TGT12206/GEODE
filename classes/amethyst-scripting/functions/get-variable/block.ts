import { GEODEView } from "classes/geode-view";
import { AmethystBlock } from "../block";
import { GetVariable } from "./instance";

export class GetVariableBlock extends AmethystBlock {
    instance: GetVariable;
    override DisplayBlock(view: GEODEView): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-get-variable-block hbox' + (this.isRightType ? '' : ' geode-type-mismatch');

        const varName = this.instance.parameters[0];
        const objID = this.instance.parameters[1];

        div.createEl('div', { text: 'Get' } );
        const varDiv = div.createDiv();
        div.createEl('div', { text: 'from' } );
        const objDiv = div.createDiv();

        const objIDInput = objDiv.createEl('select');
        const varNameInput = varDiv.createEl('select');

        const objArr = this.project.sceneView.objects;
        for (let i = 0; i < objArr.length; i++) {
            objIDInput.createEl('option', { text: i + ': ' + objArr[i].name, value: i + ': ' + objArr[i].name } );
        }

        const GetAllVarNames = () => {
            varNameInput.empty();
            const objArr = this.project.sceneView.objects;
            const varArr = objArr[this.instance.parameters[1].value].variables;
            for (let i = 0; i < varArr.length; i++) {
                varNameInput.createEl('option', { text: varArr[i].name, value: varArr[i].name } );
            }
        }
        
        view.registerDomEvent(objIDInput, 'change', () => {
            this.instance.parameters[1].value = parseInt(objIDInput.value.split(':')[0]);
            this.parentEI?.DisplayBlock(view);
        });
        view.registerDomEvent(varNameInput, 'change', () => {
            this.instance.parameters[0].value = varNameInput.value;
            this.parentEI?.DisplayBlock(view);
        });

        GetAllVarNames();

        objIDInput.value = objID.value + ': ' + objArr[objID.value].name;
        varNameInput.value = varName.value;
        
        AmethystBlock.AdjustDropdownWidth(objIDInput, div);
        AmethystBlock.AdjustDropdownWidth(varNameInput, div);
    }
}
