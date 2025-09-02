import { AmethystStructEditor } from "../struct-editor";
import { AmethystNumber } from "./number";

/**
 * A text input that changes the value of the underlying Amethyst number.
 */
export class AmethystNumberEditor extends AmethystStructEditor {
    instance: AmethystNumber;
    constructor(instance: AmethystNumber, div: HTMLDivElement) {
        super();
        this.instance = instance;
        const input = div.createEl('input', { type: 'text', value: this.instance.value + '' } );
        input.className = 'geode-text-input';
        AmethystStructEditor.AdjustInputWidth(input, div);
        input.oninput = () => {
            AmethystStructEditor.AdjustInputWidth(input, div);
        }
        input.onchange = () => {
            this.instance.value = parseFloat(input.value);
        }
    }
}