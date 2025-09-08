import { AmethystStruct, varType } from "classes/amethyst-scripting/structs/struct";
import { AmethystFunction } from "../function";
import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";

export class KeyDown extends AmethystFunction {
    static keylist = [
        'Any',
        'Space',
        'Up Arrow',
        'Down Arrow',
        'Left Arrow',
        'Right Arrow',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
    ]
    type: 'key down' = 'key down';
    override GetReturnType(): varType {
        return 'boolean';
    }
    constructor(parameters: (AmethystStruct | AmethystFunction)[] | undefined) {
        super()
        const key = AmethystStructHandler.Create('string', 'Any', 'key');
        this.defaultParameters = [key];
        if (parameters !== undefined) {
            this.parameters = parameters;
        } else {
            this.parameters.push(AmethystStructHandler.Copy(key));
        }
    }
}