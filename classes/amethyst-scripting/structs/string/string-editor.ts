import { GEODEView } from "classes/geode-view";
import { AmethystStructEditor } from "../struct-editor";
import { AmethystString } from "./string";

/**
 * A text input that changes the value of the underlying Amethyst string.
 */
export class AmethystStringEditor extends AmethystStructEditor {
    instance: AmethystString;
    constructor(instance: AmethystString, div: HTMLDivElement, view: GEODEView) {
        super();
        this.instance = instance;
        const input = div.createEl('input', { type: 'text', value: this.instance.value + '' } );
        input.className = 'geode-value-input geode-text-input';
        AmethystStructEditor.AdjustInputWidth(input, div);
        view.registerDomEvent(input, 'input', () => {
            AmethystStructEditor.AdjustInputWidth(input, div);
        });
        view.registerDomEvent(input, 'change', () => {
            this.instance.value = input.value;
            AmethystStructEditor.AdjustInputWidth(input, div);
        });
        view.registerDomEvent(input, 'drop', (event) => {
            event.stopPropagation();
            event.preventDefault();
        });
    }
}