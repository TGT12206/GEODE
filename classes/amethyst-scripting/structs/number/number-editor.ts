import { GEODEView } from "classes/geode-view";
import { AmethystStructEditor } from "../struct-editor";
import { AmethystNumber } from "./number";

/**
 * A text input that changes the value of the underlying Amethyst number.
 */
export class AmethystNumberEditor extends AmethystStructEditor {
    instance: AmethystNumber;
    constructor(instance: AmethystNumber, div: HTMLDivElement, view: GEODEView) {
        super();
        this.instance = instance;
        const input = div.createEl('input', { type: 'text', value: this.instance.value + '' } );
        input.className = 'geode-value-input geode-text-input';
        AmethystStructEditor.AdjustInputWidth(input, div);
        view.registerDomEvent(input, 'input', () => {
            AmethystStructEditor.AdjustInputWidth(input, div);
        });
        view.registerDomEvent(input, 'change', () => {
            this.instance.value = parseFloat(input.value);
            AmethystStructEditor.AdjustInputWidth(input, div);
        });
        view.registerDomEvent(input, 'drop', (event) => {
            event.preventDefault();
        });
    }
}