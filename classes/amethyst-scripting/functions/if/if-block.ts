import { AmethystBlock } from "../block";
import { If } from "./if";

export class IfBlock extends AmethystBlock {
    instance: If;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-if-block';

        const topDiv = div.createDiv('geode-if-block-condition');
        topDiv.createEl('div', { text: 'If' } );
        const conditionDiv = topDiv.createDiv();
        const functionDiv = div.createDiv();

        this.CreateValOrFunctParameterDiv(0, conditionDiv);
        this.CreateFunctParameterDiv(1, functionDiv);
    }
}
