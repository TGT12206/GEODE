import { Scope } from "classes/scope";

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
    static CreateII(struct: ASI, inspectorDiv: HTMLDivElement): ASII {
        switch(struct.type) {
            case AS.none:
            case AS.boolean:
            default:
                return new ABooleanII(struct, inspectorDiv);
            case AS.number:
                return new ANumberII(struct, inspectorDiv);
            case AS.string:
                return new AStringII(struct, inspectorDiv);
        }
    }
    static CreateEI(struct: ASI, blockDiv: HTMLDivElement): ASEI {
        switch(struct.type) {
            case AS.none:
            case AS.boolean:
            default:
                return new ABooleanEI(struct, blockDiv);
            case AS.number:
                return new ANumberEI(struct, blockDiv);
            case AS.string:
                return new AStringEI(struct, blockDiv);
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
}

export abstract class ASEI {
    instance: ASI;
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
    constructor(instance: ABooleanI, div: HTMLDivElement) {
        super();
        this.instance = instance;
    }
}

export class ABooleanEI extends ASEI {
    instance: ABooleanI;
    constructor(instance: ABooleanI, div: HTMLDivElement) {
        super();
        this.instance = instance;
        const input = div.createEl('input', { type: 'checkbox' } );
        input.checked = this.instance.value;
        input.style.backgroundColor = 'rgb(29, 0, 54)'
        input.onchange = () => {
            this.instance.value = input.checked;
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
    constructor(instance: ANumberI, div: HTMLDivElement) {
        super();
        this.instance = instance;
        const input = div.createEl('input', { type: 'text', value: this.instance.value + '' } );
        input.style.backgroundColor = 'rgb(29, 0, 54)'
        input.onchange = () => {
            this.instance.value = parseFloat(input.value);
        }
    }
}

export class ANumberEI extends ASEI {
    instance: ANumberI;
    constructor(instance: ANumberI, div: HTMLDivElement) {
        super();
        this.instance = instance;
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
    constructor(instance: AStringI, div: HTMLDivElement) {
        super();
        this.instance = instance;
        const input = div.createEl('input', { type: 'text', value: this.instance.value + '' } );
        input.style.backgroundColor = 'rgb(29, 0, 54)'
        input.onchange = () => {
            this.instance.value = input.value;
        }
    }
}

export class AStringEI extends ASEI {
    instance: AStringI;
    constructor(instance: AStringI, div: HTMLDivElement) {
        super();
        this.instance = instance;
    }
}
//#endregion String