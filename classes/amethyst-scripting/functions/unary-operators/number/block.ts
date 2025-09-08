import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBlock } from "../../block";
import { NumberUnaryOperator } from "./instance";
import { GEODEView } from "classes/geode-view";

export class NumberUnaryOperatorBlock extends AmethystBlock {
    instance: NumberUnaryOperator;
    override DisplayBlock(view: GEODEView): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-unary-operator-block hbox' + (this.isRightType ? '' : ' geode-type-mismatch');
        
        const operatorSelect = div.createEl('select');
        const numDiv = div.createDiv();

        this.DisplaySlot(1, numDiv, view, 'number');

        operatorSelect.createEl('option', { text: 'abs', value: 'abs' } );
        operatorSelect.createEl('option', { text: 'sin', value: 'sin' } );
        operatorSelect.createEl('option', { text: 'cos', value: 'cos' } );

        operatorSelect.value = (<AmethystStruct> this.instance.parameters[0]).value;
        AmethystBlock.AdjustDropdownWidth(operatorSelect, div);

        view.registerDomEvent(operatorSelect, 'change', () => {
            (<AmethystStruct> this.instance.parameters[0]).value = operatorSelect.value;
            AmethystBlock.AdjustDropdownWidth(operatorSelect, div);
        });
    }
}
