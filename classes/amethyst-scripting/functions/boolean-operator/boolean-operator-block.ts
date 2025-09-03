import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBlock } from "../block";
import { BooleanOperator } from "./boolean-operator";

export class BooleanOperatorBlock extends AmethystBlock {
    instance: BooleanOperator;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-boolean-operator-block';
        
        const bool1Div = div.createDiv();
        const operatorSelect = div.createEl('select');
        const bool2Div = div.createDiv();

        this.CreateValOrFunctParameterDiv(0, bool1Div);
        this.CreateValOrFunctParameterDiv(2, bool2Div);

        operatorSelect.createEl('option', { text: 'or', value: 'or' } );
        operatorSelect.createEl('option', { text: 'and', value: 'and' } );

        operatorSelect.value = (<AmethystStruct> this.instance.parameters[1]).value;
        AmethystBlock.AdjustDropdownWidth(operatorSelect, div);

        operatorSelect.onchange = () => {
            (<AmethystStruct> this.instance.parameters[1]).value = operatorSelect.value;
            AmethystBlock.AdjustDropdownWidth(operatorSelect, div);
        }
    }
}
