import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBlock } from "../../block";
import { NumberBinaryOperator } from "./instance";

export class NumberBinaryOperatorBlock extends AmethystBlock {
    instance: NumberBinaryOperator;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-binary-operator-block hbox';
        
        const num1Div = div.createDiv();
        const operatorSelect = div.createEl('select');
        const num2Div = div.createDiv();

        this.CreateValOrFunctParameterDiv(0, num1Div);
        this.CreateValOrFunctParameterDiv(2, num2Div);

        operatorSelect.createEl('option', { text: '+', value: '+' } );
        operatorSelect.createEl('option', { text: '-', value: '-' } );
        operatorSelect.createEl('option', { text: '*', value: '*' } );
        operatorSelect.createEl('option', { text: '÷', value: '÷' } );

        operatorSelect.value = (<AmethystStruct> this.instance.parameters[1]).value;
        AmethystBlock.AdjustDropdownWidth(operatorSelect, div);

        operatorSelect.onchange = () => {
            (<AmethystStruct> this.instance.parameters[1]).value = operatorSelect.value;
            AmethystBlock.AdjustDropdownWidth(operatorSelect, div);
        }
    }
}
