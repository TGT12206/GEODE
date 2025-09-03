import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBlock } from "../block";
import { CompareValues } from "./compare-values";

export class CompareValuesBlock extends AmethystBlock {
    instance: CompareValues;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-compare-values-block';
        // div.style.backgroundColor = CENTRAL_COLOR_1;
        // div.style.borderStyle = 'solid';
        // div.style.borderColor = ACCENT_COLOR_3;

        const val1Div = div.createDiv();
        const typeSelect = div.createEl('select');
        const val2Div = div.createDiv();

        this.CreateValOrFunctParameterDiv(0, val1Div); // CENTRAL_COLOR_3
        this.CreateValOrFunctParameterDiv(2, val2Div); // CENTRAL_COLOR_3

        typeSelect.createEl('option', { text: '=', value: '=' } );
        typeSelect.createEl('option', { text: '!=', value: '!=' } );
        typeSelect.createEl('option', { text: '<', value: '<' } );
        typeSelect.createEl('option', { text: '>', value: '>' } );
        typeSelect.createEl('option', { text: '<=', value: '<=' } );
        typeSelect.createEl('option', { text: '>=', value: '>=' } );

        typeSelect.value = (<AmethystStruct> this.instance.parameters[1]).value;
        AmethystBlock.AdjustInputWidth(typeSelect, div);

        typeSelect.onchange = () => {
            (<AmethystStruct> this.instance.parameters[1]).value = typeSelect.value;
            AmethystBlock.AdjustInputWidth(typeSelect, div);
        }

        // typeSelect.style.backgroundColor = CENTRAL_COLOR_3;
        // typeSelect.style.paddingRight = '0';
    }
}
