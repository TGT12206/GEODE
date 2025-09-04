import { GEODEView } from "classes/geode-view";
import { AmethystBlock } from "../block";
import { IfElse } from "./if-else";

export class IfElseBlock extends AmethystBlock {
    instance: IfElse;
    override DisplayBlock(view: GEODEView): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-if-block vbox';

        const topDiv = div.createDiv('geode-block-inner-section hbox');
        topDiv.createEl('div', { text: 'If' } );
        const conditionDiv = topDiv.createDiv();
        const function1Div = div.createDiv();
        div.createEl('div', { text: 'Else' } );
        const function2Div = div.createDiv();

        this.CreateValOrFunctParameterDiv(0, conditionDiv, view);
        this.CreateFunctParameterDiv(1, function1Div, view);
        this.CreateFunctParameterDiv(2, function2Div, view);
    }
}
