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
import { CompareNumbers } from "./compare-values/compare-numbers";
import { CompareNumbersBlock } from "./compare-values/compare-numbers-block";
import { RuntimeCompareNumbers } from "./compare-values/runtime-compare-numbers";
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
import { SetVariable } from "./set-variable/set-variable";
import { SetVariableBlock } from "./set-variable/set-variable-block";
import { RuntimeSetVariable } from "./set-variable/runtime-set-variable";
import { AmethystBlock } from "./block";
import { BooleanBinaryOperator } from "./binary-operators/boolean/instance";
import { NumberBinaryOperator } from "./binary-operators/number/instance";
import { BooleanBinaryOperatorBlock } from "./binary-operators/boolean/block";
import { NumberBinaryOperatorBlock } from "./binary-operators/number/block";
import { RuntimeBooleanBinaryOperator } from "./binary-operators/boolean/runtime";
import { RuntimeNumberBinaryOperator } from "./binary-operators/number/runtime";
import { Project } from "classes/project";
import { GEODEView } from "classes/geode-view";

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
            case 'compare numbers':
                return new CompareNumbers(parameters);
            case 'boolean binary operator':
                return new BooleanBinaryOperator(parameters);
            case 'number binary operator':
                return new NumberBinaryOperator(parameters);
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
            case 'compare numbers':
                return new CompareNumbers(newParams);
            case 'boolean binary operator':
                return new BooleanBinaryOperator(newParams);
            case 'number binary operator':
                return new NumberBinaryOperator(newParams);
        }
    }
    static CreateBlock(obj: AmethystFunction, blockDiv: HTMLDivElement, view: GEODEView, project: Project): AmethystBlock {
        switch(obj.type) {
            case 'none':
            default:
                return new DoNothingBlock(obj, blockDiv, view ,project);
            case 'chain':
                return new ChainBlock(obj, blockDiv, view ,project);
            case 'get variable':
                return new GetVariableBlock(obj, blockDiv, view ,project);
            case 'set variable':
                return new SetVariableBlock(obj, blockDiv, view ,project);
            case 'if':
                return new IfBlock(obj, blockDiv, view ,project);
            case 'if else':
                return new IfElseBlock(obj, blockDiv, view ,project);
            case 'key down':
                return new KeyDownBlock(obj, blockDiv, view ,project);
            case 'compare numbers':
                return new CompareNumbersBlock(obj, blockDiv, view ,project);
            case 'boolean binary operator':
                return new BooleanBinaryOperatorBlock(obj, blockDiv, view ,project);
            case 'number binary operator':
                return new NumberBinaryOperatorBlock(obj, blockDiv, view ,project);
        }
    }
    static CreateRuntimeInstance(obj: AmethystFunction, project: Project): AmethystRuntimeFunction {
        switch(obj.type) {
            case 'none':
            default:
                return new RuntimeDoNothing(obj, project);
            case 'chain':
                return new RuntimeChain(obj, project);
            case 'get variable':
                return new RuntimeGetVariable(obj, project);
            case 'set variable':
                return new RuntimeSetVariable(obj, project);
            case 'if':
                return new RuntimeIf(obj, project);
            case 'if else':
                return new RuntimeIfElse(obj, project);
            case 'key down':
                return new RuntimeKeyDown(obj, project);
            case 'compare numbers':
                return new RuntimeCompareNumbers(obj, project);
            case 'boolean binary operator':
                return new RuntimeBooleanBinaryOperator(obj, project);
            case 'number binary operator':
                return new RuntimeNumberBinaryOperator(obj, project);
        }
    }
}