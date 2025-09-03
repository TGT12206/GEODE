import { AmethystBlock } from "../block";
import { NumberOperator } from "./number-operator";

export class NumberOperatorBlock extends AmethystBlock {
    instance: NumberOperator;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-number-operator-block';
        // div.style.backgroundColor = CENTRAL_COLOR_1;
        // div.style.borderStyle = 'solid';
        // div.style.borderColor = ACCENT_COLOR_3;

        const num1Div = div.createDiv();
        div.createEl('div', { text: '+' } );
        const num2Div = div.createDiv();

        this.CreateValOrFunctParameterDiv(0, num1Div); // CENTRAL_COLOR_3
        this.CreateValOrFunctParameterDiv(1, num2Div); // CENTRAL_COLOR_3
    }
}
