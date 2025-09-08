import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { BooleanBinaryOperator } from "./instance";
import { AmethystBlock } from "../../block";
import { GEODEView } from "classes/geode-view";

export class BooleanBinaryOperatorBlock extends AmethystBlock {
    instance: BooleanBinaryOperator;
    override DisplayBlock(view: GEODEView): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-binary-operator-block hbox' + (this.isRightType ? '' : ' geode-type-mismatch');
        
        const bool1Div = div.createDiv();
        const operatorSelect = div.createEl('select');
        const bool2Div = div.createDiv();

        this.DisplaySlot(0, bool1Div, view, 'boolean');
        this.DisplaySlot(2, bool2Div, view, 'boolean');

        operatorSelect.createEl('option', { text: 'or', value: 'or' } );
        operatorSelect.createEl('option', { text: 'and', value: 'and' } );

        operatorSelect.value = (<AmethystStruct> this.instance.parameters[1]).value;
        AmethystBlock.AdjustDropdownWidth(operatorSelect, div);

        view.registerDomEvent(operatorSelect, 'change', () => {
            (<AmethystStruct> this.instance.parameters[1]).value = operatorSelect.value;
            AmethystBlock.AdjustDropdownWidth(operatorSelect, div);
        });
    }
}
