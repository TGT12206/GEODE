import { AppAndProject } from "classes/project";
import { AmethystStruct } from "../structs/struct";
import { AmethystStructHandler } from "../structs/struct-handler";
import { DoNothing } from "./do-nothing/do-nothing";
import { DoNothingBlock } from "./do-nothing/do-nothing-block";
import { RuntimeDoNothing } from "./do-nothing/runtime-do-nothing";
import { AmethystFunction } from "./function";
import { Chain } from "./chain/chain";
import { ChainBlock } from "./chain/chain-block";
import { RuntimeChain } from "./chain/runtime-chain";
import { AmethystRuntimeFunction } from "./runtime-function";
import { CompareValues } from "./compare-values/compare-values";
import { CompareValuesBlock } from "./compare-values/compare-values-block";
import { RuntimeCompareValues } from "./compare-values/runtime-compare-values";
import { GetVariable } from "./get-variable/get-variable";
import { GetVariableBlock } from "./get-variable/get-variable-block";
import { RuntimeGetVariable } from "./get-variable/runtime-get-variable";
import { If } from "./if/if";
import { IfBlock } from "./if/if-block";
import { RuntimeIf } from "./if/runtime-if";
import { IfElse } from "./if-else/if-else";
import { IfElseBlock } from "./if-else/if-else-block";
import { RuntimeIfElse } from "./if-else/runtime-if-else";
import { KeyDownBlock } from "./key-down/key-down-block";
import { RuntimeKeyDown } from "./key-down/runtime-key-down";
import { KeyDown } from "./key-down/key-down";
import { NumberOperator } from "./number-operator/number-operator";
import { SetVariable } from "./set-variable/set-variable";
import { SetVariableBlock } from "./set-variable/set-variable-block";
import { NumberOperatorBlock } from "./number-operator/number-operator-block";
import { RuntimeSetVariable } from "./set-variable/runtime-set-variable";
import { RuntimeNumberOperator } from "./number-operator/runtime-number-operator";
import { AmethystBlock } from "./block";
import { BooleanOperator } from "./boolean-operator/boolean-operator";
import { BooleanOperatorBlock } from "./boolean-operator/boolean-operator-block";
import { RuntimeBooleanOperator } from "./boolean-operator/runtime-boolean-operator";

export class AmethystFunctionHandler {
    static Create(type: string, parameters: (AmethystStruct | AmethystFunction)[] | undefined = undefined): AmethystFunction {
        switch(type) {
            case 'none':
            default:
                return new DoNothing();
            case 'chain':
                return new Chain(<AmethystFunction[] | undefined> parameters);
            case 'get variable':
                return new GetVariable(<AmethystStruct[] | undefined> parameters);
            case 'set variable':
                return new SetVariable(parameters);
            case 'if':
                return new If(parameters);
            case 'if else':
                return new IfElse(parameters);
            case 'key down':
                return new KeyDown(parameters);
            case 'compare values':
                return new CompareValues(parameters);
            case 'boolean operator':
                return new BooleanOperator(parameters);
            case 'number operator':
                return new NumberOperator(parameters);
        }
    }
    static Copy(obj: AmethystFunction): AmethystFunction {
        const newParams = [];
        for (let i = 0; i < obj.parameters.length; i++) {
            const currParam = obj.parameters[i];
            if (currParam instanceof AmethystFunction) {
                newParams.push(this.Copy(currParam));
            } else {
                newParams.push(AmethystStructHandler.Copy(currParam));
            }
        }
        switch(obj.type) {
            case 'none':
            default:
                return new DoNothing();
            case 'chain':
                return new Chain(<AmethystFunction[]> newParams);
            case 'get variable':
                return new GetVariable(<AmethystStruct[]> newParams);
            case 'set variable':
                return new SetVariable(newParams);
            case 'if':
                return new If(newParams);
            case 'if else':
                return new IfElse(newParams);
            case 'key down':
                return new KeyDown(newParams);
            case 'compare values':
                return new CompareValues(newParams);
            case 'boolean operator':
                return new BooleanOperator(newParams);
            case 'number operator':
                return new NumberOperator(newParams);
        }
    }
    static CreateBlock(obj: AmethystFunction, blockDiv: HTMLDivElement, anp: AppAndProject): AmethystBlock {
        switch(obj.type) {
            case 'none':
            default:
                return new DoNothingBlock(obj, blockDiv, anp);
            case 'chain':
                return new ChainBlock(obj, blockDiv, anp);
            case 'get variable':
                return new GetVariableBlock(obj, blockDiv, anp);
            case 'set variable':
                return new SetVariableBlock(obj, blockDiv, anp);
            case 'if':
                return new IfBlock(obj, blockDiv, anp);
            case 'if else':
                return new IfElseBlock(obj, blockDiv, anp);
            case 'key down':
                return new KeyDownBlock(obj, blockDiv, anp);
            case 'compare values':
                return new CompareValuesBlock(obj, blockDiv, anp);
            case 'boolean operator':
                return new BooleanOperatorBlock(obj, blockDiv, anp);
            case 'number operator':
                return new NumberOperatorBlock(obj, blockDiv, anp);
        }
    }
    static CreateRuntimeInstance(obj: AmethystFunction, anp: AppAndProject): AmethystRuntimeFunction {
        switch(obj.type) {
            case 'none':
            default:
                return new RuntimeDoNothing(obj, anp);
            case 'chain':
                return new RuntimeChain(obj, anp);
            case 'get variable':
                return new RuntimeGetVariable(obj, anp);
            case 'set variable':
                return new RuntimeSetVariable(obj, anp);
            case 'if':
                return new RuntimeIf(obj, anp);
            case 'if else':
                return new RuntimeIfElse(obj, anp);
            case 'key down':
                return new RuntimeKeyDown(obj, anp);
            case 'compare values':
                return new RuntimeCompareValues(obj, anp);
            case 'boolean operator':
                return new RuntimeBooleanOperator(obj, anp);
            case 'number operator':
                return new RuntimeNumberOperator(obj, anp);
        }
    }
}