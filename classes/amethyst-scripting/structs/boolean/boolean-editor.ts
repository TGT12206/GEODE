import { AmethystStructEditor } from "../struct-editor";
import { AmethystBoolean } from "./boolean";

/**
 * A checkbox that changes the value of the underlying Amethyst boolean.
 */
export class AmethystBooleanEditor extends AmethystStructEditor {
    instance: AmethystBoolean;
    constructor(instance: AmethystBoolean, div: HTMLDivElement) {
        super();
        this.instance = instance;
        const input = div.createEl('input', { type: 'checkbox' } );
        input.checked = this.instance.value;
        input.className = 'geode-value-input geode-boolean-input ' + (input.checked ? 'geode-checked' : 'geode-unchecked');
        input.onclick = () => {
            this.instance.value = input.checked;
            input.className = 'geode-value-input geode-boolean-input ' + (input.checked ? 'geode-checked' : 'geode-unchecked');
        }
    }
}