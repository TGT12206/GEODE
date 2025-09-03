import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBlock } from "../block";
import { KeyDown } from "./key-down";

export class KeyDownBlock extends AmethystBlock {
    instance: KeyDown;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-key-down-block';
        // div.style.backgroundColor = CENTRAL_COLOR_1;
        // div.style.borderStyle = 'solid';
        // div.style.borderColor = ACCENT_COLOR_3;

        const keySelect = div.createEl('select');
        div.createEl('div', { text: 'Key Down?' } );

        for (let i = 0; i < KeyDown.keylist.length; i++) {
            const currKey = KeyDown.keylist[i];
            keySelect.createEl('option', { text: currKey, value: currKey } );
        }

        keySelect.value = (<AmethystStruct> this.instance.parameters[0]).value;
        AmethystBlock.AdjustInputWidth(keySelect, div);

        keySelect.onchange = () => {
            (<AmethystStruct> this.instance.parameters[0]).value = keySelect.value;
            AmethystBlock.AdjustInputWidth(keySelect, div);
        }

        // keySelect.style.backgroundColor = CENTRAL_COLOR_3;
        // keySelect.style.paddingRight = '0';
    }
}
