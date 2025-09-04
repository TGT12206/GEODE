import { GEODEView } from "classes/geode-view";
import { AmethystStruct } from "./struct";

/**
 * Creates HTML that allows the user to edit the underlying variable.
 */
export abstract class AmethystStructEditor {
    /**
     * The variable represented by this editor
     */
    instance: AmethystStruct;

    /**
     * Adjusts the width of an input or select element to fit the text inside of it
     * @param input the input element to adjust the width of
     * @param div a clean div to create the temporary span in
     */
    static AdjustInputWidth(input: HTMLInputElement | HTMLSelectElement, div: HTMLDivElement) {
        /**
         * Although I'm technically hard coding these css values,
         * I hope it will be obvious why this is necessary.
         */
        const tempEl = div.createEl('div', { text: input.value } );
        tempEl.className = 'geode-temporary-input-width-checker';
        tempEl.style.font = input.style.font;
        tempEl.style.fontSize = input.style.fontSize;

        input.style.width = tempEl.getBoundingClientRect().width + 'px';
        
        tempEl.remove();
    }
}