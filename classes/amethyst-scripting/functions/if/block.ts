import { GEODEView } from "classes/geode-view";
import { AmethystBlock } from "../block";
import { If } from "./instance";

export class IfBlock extends AmethystBlock {
    instance: If;
    override DisplayBlock(view: GEODEView): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-if-block vbox' + (this.isRightType ? '' : ' geode-type-mismatch');

        const topDiv = div.createDiv('geode-block-inner-section hbox');
        topDiv.createEl('div', { text: 'If' } );
        const conditionDiv = topDiv.createDiv();
        const functionDiv = div.createDiv();

        this.DisplaySlot(0, conditionDiv, view, 'boolean');
        this.DisplayFunctionSlot(1, functionDiv, view);
    }
}
