import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBlock } from "../block";
import { CompareNumbers } from "./compare-numbers";
import { GEODEView } from "classes/geode-view";

export class CompareNumbersBlock extends AmethystBlock {
    instance: CompareNumbers;
    override DisplayBlock(view: GEODEView): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-compare-values-block hbox';

        const val1Div = div.createDiv();
        const typeSelect = div.createEl('select');
        const val2Div = div.createDiv();

        this.CreateValOrFunctParameterDiv(0, val1Div, view);
        this.CreateValOrFunctParameterDiv(2, val2Div, view);

        typeSelect.createEl('option', { text: '=', value: '=' } );
        typeSelect.createEl('option', { text: '!=', value: '!=' } );
        typeSelect.createEl('option', { text: '<', value: '<' } );
        typeSelect.createEl('option', { text: '>', value: '>' } );
        typeSelect.createEl('option', { text: '<=', value: '<=' } );
        typeSelect.createEl('option', { text: '>=', value: '>=' } );

        typeSelect.value = (<AmethystStruct> this.instance.parameters[1]).value;
        AmethystBlock.AdjustDropdownWidth(typeSelect, div);

        view.registerDomEvent(typeSelect, 'change', () => {
            (<AmethystStruct> this.instance.parameters[1]).value = typeSelect.value;
            AmethystBlock.AdjustDropdownWidth(typeSelect, div);
        });
    }
}
