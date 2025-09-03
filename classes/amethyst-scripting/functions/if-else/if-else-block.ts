import { AmethystBlock } from "../block";
import { IfElse } from "./if-else";

export class IfElseBlock extends AmethystBlock {
    instance: IfElse;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-if-else-block';
        // div.style.backgroundColor = ACCENT_COLOR_2;
        // div.style.borderStyle = 'solid';
        // div.style.borderColor = ACCENT_COLOR_3;

        const topDiv = div.createDiv('geod3-if-block-condition');
        topDiv.createEl('div', { text: 'If' } );
        const conditionDiv = topDiv.createDiv();
        const function1Div = div.createDiv();
        div.createEl('div', { text: 'Else' } );
        const function2Div = div.createDiv();

        this.CreateValOrFunctParameterDiv(0, conditionDiv); // ACCENT_COLOR_3
        this.CreateFunctParameterDiv(1, function1Div); // ACCENT_COLOR_3
        this.CreateFunctParameterDiv(2, function2Div); // ACCENT_COLOR_3
    }
}
