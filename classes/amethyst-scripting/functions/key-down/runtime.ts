import { AmethystBoolean } from "classes/amethyst-scripting/structs/boolean/boolean";
import { AmethystRuntimeFunction } from "../runtime-function";
import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";

export class RuntimeKeyDown extends AmethystRuntimeFunction {
    async Execute(): Promise<AmethystBoolean> {
        const key = <AmethystStruct> this.parameters[0];
        
        const output = AmethystStructHandler.Create('boolean', false, 'output');
        const isKeyDown = this.project.gameView.pressedKeys.get(key.value);
        output.value = isKeyDown === undefined ? false : isKeyDown;

        return <AmethystBoolean> output;
    }
}