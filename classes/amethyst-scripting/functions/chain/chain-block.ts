import { AmethystBlock } from "../block";
import { DoNothing } from "../do-nothing/do-nothing";
import { AmethystFunction } from "../function";
import { AmethystFunctionHandler } from "../function-handler";
import { Chain } from "./chain";

export class ChainBlock extends AmethystBlock {
    instance: Chain;
    override DisplayBlock(): void {
        this.div.empty();
        const div = this.div;
        div.className = 'geode-script-block geode-chain-block vbox';

        for (let i = 0; i < this.instance.parameters.length; i++) {
            const index = i;
            const currBlockDiv = div.createDiv('geode-block-inner-section hbox');
            
            const deleteButton = currBlockDiv.createEl('button', { text: '-' } );
            const addButton = currBlockDiv.createEl('button', { text: '+' } );

            deleteButton.className = 'geode-remove-button';
            addButton.className = 'geode-add-button';

            deleteButton.onclick = () => {
                this.instance.parameters.splice(index, 1);
                this.DisplayBlock();
            }
            addButton.onclick = () => {
                this.instance.parameters.splice(index, 0, new DoNothing());
                this.DisplayBlock();
            }

            this.CreateFunctParameterDiv(index, currBlockDiv.createDiv());
        }
        const addButton = div.createEl('button', { text: '+' } );
        addButton.className = 'geode-add-button geode-chain-final-add-slot';

        addButton.onclick = () => {
            this.instance.parameters.splice(this.instance.parameters.length, 0, new DoNothing());
            this.DisplayBlock();
        }
    }
    override RemoveParameter(parameter: AmethystFunction): void {
        for (let i = 0; i < this.instance.parameters.length; i++) {
            if (this.instance.parameters[i] === parameter) {
                this.instance.parameters[i] = AmethystFunctionHandler.Copy(this.instance.defaultParameters[0]);
            }
        }
    }
}