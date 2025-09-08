import { BooleanUnaryOperator } from "./instance";
import { AmethystBlock } from "../../block";
import { GEODEView } from "classes/geode-view";

export class BooleanUnaryOperatorBlock extends AmethystBlock {
    instance: BooleanUnaryOperator;
    override DisplayBlock(view: GEODEView): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-unary-operator-block hbox' + (this.isRightType ? '' : ' geode-type-mismatch');
        
        div.createEl('div', { text: '!' } );
        const bool1Div = div.createDiv();

        this.DisplaySlot(0, bool1Div, view, 'boolean');
    }
}
