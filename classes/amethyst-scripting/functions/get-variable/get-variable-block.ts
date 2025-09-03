import { AmethystBlock } from "../block";
import { GetVariable } from "./get-variable";

export class GetVariableBlock extends AmethystBlock {
    instance: GetVariable;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-get-variable-block';
        const anp = this.anp;

        const varName = this.instance.parameters[0];
        const objID = this.instance.parameters[1];

        div.createEl('div', { text: 'Get' } );
        const varDiv = div.createDiv();
        div.createEl('div', { text: 'from' } );
        const objDiv = div.createDiv();

        const objIDInput = objDiv.createEl('select');
        const varNameInput = varDiv.createEl('select');

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
            AmethystBlock.AdjustDropdownWidth(objIDInput, div);
            GetAllVarNames();
        }
        varNameInput.onchange = () => {
            this.instance.parameters[0].value = varNameInput.value;
            AmethystBlock.AdjustDropdownWidth(varNameInput, div);
        }

        GetAllVarNames();

        objIDInput.value = objID.value + ': ' + objArr[objID.value].name;
        varNameInput.value = varName.value;
        
        AmethystBlock.AdjustDropdownWidth(objIDInput, div);
        AmethystBlock.AdjustDropdownWidth(varNameInput, div);
    }
}
