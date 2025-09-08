import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { GEODEView } from "classes/geode-view";
import { AmethystBlock } from "../../block";
import { CompareEquality } from "./instance";
import { AmethystFunction } from "../../function";

export class CompareEqualityBlock extends AmethystBlock {
    instance: CompareEquality;
    override DisplayBlock(view: GEODEView): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-compare-values-block hbox' + (this.isRightType ? '' : ' geode-type-mismatch');

        const val1Div = div.createDiv();
        const typeSelect = div.createEl('select');
        const val2Div = div.createDiv();
        
        const val1 = this.instance.parameters[0];
        const val1IsFunction = val1 instanceof AmethystFunction;
        const val1VarType = val1IsFunction ? val1.GetReturnType(this.project) : val1.type;

        this.DisplaySlot(0, val1Div, view);
        this.DisplaySlot(2, val2Div, view, val1VarType);

        typeSelect.createEl('option', { text: '=', value: '=' } );
        typeSelect.createEl('option', { text: '!=', value: '!=' } );

        typeSelect.value = (<AmethystStruct> this.instance.parameters[1]).value;
        AmethystBlock.AdjustDropdownWidth(typeSelect, div);

        view.registerDomEvent(typeSelect, 'change', () => {
            (<AmethystStruct> this.instance.parameters[1]).value = typeSelect.value;
            AmethystBlock.AdjustDropdownWidth(typeSelect, div);
        });
    }
}