import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystBlock } from "../block";
import { KeyDown } from "./key-down";

export class KeyDownBlock extends AmethystBlock {
    instance: KeyDown;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-key-down-block';

        const keySelect = div.createEl('select');
        div.createEl('div', { text: 'key down?' } );

        for (let i = 0; i < KeyDown.keylist.length; i++) {
            const currKey = KeyDown.keylist[i];
            keySelect.createEl('option', { text: currKey, value: currKey } );
        }

        keySelect.value = (<AmethystStruct> this.instance.parameters[0]).value;
        AmethystBlock.AdjustDropdownWidth(keySelect, div);

        keySelect.onchange = () => {
            (<AmethystStruct> this.instance.parameters[0]).value = keySelect.value;
            AmethystBlock.AdjustDropdownWidth(keySelect, div);
        }
    }
}
