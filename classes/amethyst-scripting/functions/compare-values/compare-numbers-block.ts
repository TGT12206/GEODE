import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBlock } from "../block";
import { CompareNumbers } from "./compare-numbers";

export class CompareNumbersBlock extends AmethystBlock {
    instance: CompareNumbers;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-compare-values-block hbox';

        const val1Div = div.createDiv();
        const typeSelect = div.createEl('select');
        const val2Div = div.createDiv();

        this.CreateValOrFunctParameterDiv(0, val1Div);
        this.CreateValOrFunctParameterDiv(2, val2Div);

        typeSelect.createEl('option', { text: '=', value: '=' } );
        typeSelect.createEl('option', { text: '!=', value: '!=' } );
        typeSelect.createEl('option', { text: '<', value: '<' } );
        typeSelect.createEl('option', { text: '>', value: '>' } );
        typeSelect.createEl('option', { text: '<=', value: '<=' } );
        typeSelect.createEl('option', { text: '>=', value: '>=' } );

        typeSelect.value = (<AmethystStruct> this.instance.parameters[1]).value;
        AmethystBlock.AdjustDropdownWidth(typeSelect, div);

        typeSelect.onchange = () => {
            (<AmethystStruct> this.instance.parameters[1]).value = typeSelect.value;
            AmethystBlock.AdjustDropdownWidth(typeSelect, div);
        }

        // typeSelect.style.backgroundColor = CENTRAL_COLOR_3;
        // typeSelect.style.paddingRight = '0';
    }
}
