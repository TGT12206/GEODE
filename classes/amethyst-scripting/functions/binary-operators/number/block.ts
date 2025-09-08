import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBlock } from "../../block";
import { NumberBinaryOperator } from "./instance";
import { GEODEView } from "classes/geode-view";

export class NumberBinaryOperatorBlock extends AmethystBlock {
    instance: NumberBinaryOperator;
    override DisplayBlock(view: GEODEView): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-binary-operator-block hbox' + (this.isRightType ? '' : ' geode-type-mismatch');
        
        const num1Div = div.createDiv();
        const operatorSelect = div.createEl('select');
        const num2Div = div.createDiv();

        this.DisplaySlot(0, num1Div, view, 'number');
        this.DisplaySlot(2, num2Div, view, 'number');

        operatorSelect.createEl('option', { text: '+', value: '+' } );
        operatorSelect.createEl('option', { text: '-', value: '-' } );
        operatorSelect.createEl('option', { text: '*', value: '*' } );
        operatorSelect.createEl('option', { text: '÷', value: '÷' } );

        operatorSelect.value = (<AmethystStruct> this.instance.parameters[1]).value;
        AmethystBlock.AdjustDropdownWidth(operatorSelect, div);

        view.registerDomEvent(operatorSelect, 'change', () => {
            (<AmethystStruct> this.instance.parameters[1]).value = operatorSelect.value;
            AmethystBlock.AdjustDropdownWidth(operatorSelect, div);
        });
    }
}
