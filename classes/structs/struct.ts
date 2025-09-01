import { Scope } from "classes/scope";
import { BG_COLOR_1, BG_COLOR_2, BG_COLOR_3, ACCENT_COLOR_1, ACCENT_COLOR_2, ACCENT_COLOR_3, CENTRAL_COLOR_1, CENTRAL_COLOR_2, CENTRAL_COLOR_3, REMOVE_COLOR_1, REMOVE_COLOR_2 } from "colors";

export enum AS {
    'none',
    'boolean',
    'number',
    'string'
}

export class ASHandler {
    static Copy(obj: ASI): ASI {
        let newObj;
        switch(obj.type) {
            case AS.none:
            case AS.boolean:
            default:
                newObj = new ABooleanI(obj.scope, obj.name);
                break;
            case AS.number:
                newObj = new ANumberI(obj.scope, obj.name);
                break;
            case AS.string:
                newObj = new AStringI(obj.scope, obj.name);
                break;
        }
        newObj.value = obj.value;
        return newObj;
    }
    static CreateI(type: AS, scope: Scope, name: string): ASI {
        switch(type) {
            case AS.none:
            case AS.boolean:
            default:
                return new ABooleanI(scope, name);
            case AS.number:
                return new ANumberI(scope, name);
            case AS.string:
                return new AStringI(scope, name);
        }
    }
    static CreateII(struct: ASI, inspectorDiv: HTMLDivElement, color: string | undefined = undefined): ASII {
        switch(struct.type) {
            case AS.none:
            case AS.boolean:
            default:
                return new ABooleanII(struct, inspectorDiv, color);
            case AS.number:
                return new ANumberII(struct, inspectorDiv, color);
            case AS.string:
                return new AStringII(struct, inspectorDiv, color);
        }
    }
}

export abstract class ASI {
    name: string;
    type: AS;
    value: any;
    scope: Scope;
    constructor(scope: Scope, name = '') {
        this.name = name;
        this.scope = scope;
    }
}

export abstract class ASII {
    instance: ASI;
    static AdjustInputWidth(input: HTMLInputElement | HTMLSelectElement, div: HTMLDivElement) {
        const tempEl = div.createEl('div', { text: input.value } );
        tempEl.style.position = 'absolute';
        tempEl.style.visibility = 'hidden';
        tempEl.style.whiteSpace = 'nowrap';
        tempEl.style.font = 'inherit';
        tempEl.style.padding = input instanceof HTMLInputElement ? '1vh' : '2vh';
        input.style.width = tempEl.getBoundingClientRect().width + 'px';
        tempEl.remove();
    }
}

//#region Boolean
export class ABooleanI extends ASI {
    type = AS.boolean;
    value: boolean;
    constructor(scope: Scope, name = '') {
        super(scope, name);
        this.value = false;
    }
}

export class ABooleanII extends ASII {
    instance: ABooleanI;
    constructor(instance: ABooleanI, div: HTMLDivElement, color: string | undefined = undefined) {
        super();
        this.instance = instance;
        const input = div.createEl('input', { type: 'checkbox' } );
        input.checked = this.instance.value;
        input.style.backgroundColor = color === undefined ? CENTRAL_COLOR_3 : color;
        input.onclick = () => {
            this.instance.value = input.checked;
            input.style.backgroundColor = input.checked ? CENTRAL_COLOR_1 : CENTRAL_COLOR_3;
        }
    }
}
//#endregion Boolean

//#region Number
export class ANumberI extends ASI {
    type = AS.number;
    value: number;
    constructor(scope: Scope, name = '') {
        super(scope, name);
        this.value = 0;
    }
}

export class ANumberII extends ASII {
    instance: ANumberI;
    constructor(instance: ANumberI, div: HTMLDivElement, color: string | undefined = undefined) {
        super();
        this.instance = instance;
        const input = div.createEl('input', { type: 'text', value: this.instance.value + '' } );
        ASII.AdjustInputWidth(input, div);
        input.style.backgroundColor = color === undefined ? CENTRAL_COLOR_3 : color;
        input.oninput = () => {
            ASII.AdjustInputWidth(input, div);
        }
        input.onchange = () => {
            this.instance.value = parseFloat(input.value);
        }
    }
}
//#endregion Number

//#region String
export class AStringI extends ASI {
    type = AS.string;
    value: string;
    constructor(scope: Scope, name = '') {
        super(scope, name);
        this.value = '';
    }
}

export class AStringII extends ASII {
    instance: AStringI;
    constructor(instance: AStringI, div: HTMLDivElement, color: string | undefined = undefined) {
        super();
        this.instance = instance;
        const input = div.createEl('input', { type: 'text', value: this.instance.value + '' } );
        ASII.AdjustInputWidth(input, div);
        input.style.backgroundColor = color === undefined ? CENTRAL_COLOR_3 : color;
        input.oninput = () => {
            ASII.AdjustInputWidth(input, div);
        }
        input.onchange = () => {
            this.instance.value = input.value;
        }
    }
}
//#endregion String