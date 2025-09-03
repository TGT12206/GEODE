import { AmethystBlock } from "../block";
import { If } from "./if";

export class IfBlock extends AmethystBlock {
    instance: If;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-if-block';
        // div.style.backgroundColor = ACCENT_COLOR_2;
        // div.style.borderStyle = 'solid';
        // div.style.borderColor = ACCENT_COLOR_3;

        const topDiv = div.createDiv('geode-if-block-condition');
        topDiv.createEl('div', { text: 'If' } );
        const conditionDiv = topDiv.createDiv();
        const functionDiv = div.createDiv();

        this.CreateValOrFunctParameterDiv(0, conditionDiv); // ACCENT_COLOR_3
        this.CreateFunctParameterDiv(1, functionDiv); // ACCENT_COLOR_3
    }
}
