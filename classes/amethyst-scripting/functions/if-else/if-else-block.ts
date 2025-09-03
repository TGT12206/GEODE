import { AmethystBlock } from "../block";
import { IfElse } from "./if-else";

export class IfElseBlock extends AmethystBlock {
    instance: IfElse;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-if-else-block';

        const topDiv = div.createDiv('geode-if-block-condition');
        topDiv.createEl('div', { text: 'If' } );
        const conditionDiv = topDiv.createDiv();
        const function1Div = div.createDiv();
        div.createEl('div', { text: 'Else' } );
        const function2Div = div.createDiv();

        this.CreateValOrFunctParameterDiv(0, conditionDiv);
        this.CreateFunctParameterDiv(1, function1Div);
        this.CreateFunctParameterDiv(2, function2Div);
    }
}
