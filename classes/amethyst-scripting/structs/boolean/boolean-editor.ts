import { GEODEView } from "classes/geode-view";
import { AmethystStructEditor } from "../struct-editor";
import { AmethystBoolean } from "./boolean";

/**
 * A checkbox that changes the value of the underlying Amethyst boolean.
 */
export class AmethystBooleanEditor extends AmethystStructEditor {
    instance: AmethystBoolean;
    constructor(instance: AmethystBoolean, div: HTMLDivElement, view: GEODEView) {
        super();
        this.instance = instance;
        const input = div.createEl('input', { type: 'checkbox' } );
        const unchangingClasses = 'geode-value-input geode-boolean-input geode-';
        input.checked = this.instance.value;
        input.className = unchangingClasses + (input.checked ? 'checked' : 'unchecked');
        view.registerDomEvent(input, 'click', () => {
            this.instance.value = input.checked;
            input.className = unchangingClasses + (input.checked ? 'checked' : 'unchecked');
        });
    }
}