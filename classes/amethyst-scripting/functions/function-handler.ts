import { AmethystStruct } from "../structs/struct";
import { AmethystStructHandler } from "../structs/struct-handler";
import { DoNothing } from "./do-nothing/instance";
import { DoNothingBlock } from "./do-nothing/block";
import { RuntimeDoNothing } from "./do-nothing/runtime";
import { AmethystFunction, functionType } from "./function";
import { Chain } from "./chain/instance";
import { ChainBlock } from "./chain/block";
import { RuntimeChain } from "./chain/runtime";
import { AmethystRuntimeFunction } from "./runtime-function";
import { GetVariable } from "./get-variable/instance";
import { GetVariableBlock } from "./get-variable/block";
import { RuntimeGetVariable } from "./get-variable/runtime";
import { If } from "./if/instance";
import { IfBlock } from "./if/block";
import { RuntimeIf } from "./if/runtime";
import { IfElse } from "./if-else/instance";
import { IfElseBlock } from "./if-else/block";
import { RuntimeIfElse } from "./if-else/runtime";
import { KeyDownBlock } from "./key-down/block";
import { RuntimeKeyDown } from "./key-down/runtime";
import { KeyDown } from "./key-down/instance";
import { SetVariable } from "./set-variable/instance";
import { SetVariableBlock } from "./set-variable/block";
import { RuntimeSetVariable } from "./set-variable/runtime";
import { AmethystBlock } from "./block";
import { BooleanBinaryOperator } from "./binary-operators/boolean/instance";
import { NumberBinaryOperator } from "./binary-operators/number/instance";
import { BooleanBinaryOperatorBlock } from "./binary-operators/boolean/block";
import { NumberBinaryOperatorBlock } from "./binary-operators/number/block";
import { RuntimeBooleanBinaryOperator } from "./binary-operators/boolean/runtime";
import { RuntimeNumberBinaryOperator } from "./binary-operators/number/runtime";
import { Project } from "classes/project";
import { GEODEView } from "classes/geode-view";
import { CompareOrdinals } from "./compare-values/ordinal/instance";
import { CompareOrdinalsBlock } from "./compare-values/ordinal/block";
import { RuntimeCompareOrdinals } from "./compare-values/ordinal/runtime";
import { CompareEquality } from "./compare-values/equality/instance";
import { CompareEqualityBlock } from "./compare-values/equality/block";
import { RuntimeCompareEquality } from "./compare-values/equality/runtime";
import { BooleanUnaryOperatorBlock } from "./unary-operators/boolean/block";
import { NumberUnaryOperatorBlock } from "./unary-operators/number/block";
import { RuntimeBooleanUnaryOperator } from "./unary-operators/boolean/runtime";
import { RuntimeNumberUnaryOperator } from "./unary-operators/number/runtime";
import { BooleanUnaryOperator } from "./unary-operators/boolean/instance";
import { NumberUnaryOperator } from "./unary-operators/number/instance";

/**
 * If adding a function type, make sure to add it to FunctionStruct's type and knownTypes as well
 */

export class AmethystFunctionHandler {
    static Create(type: functionType, parameters: (AmethystStruct | AmethystFunction)[] | undefined = undefined): AmethystFunction {
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
            case 'compare equality':
                return new CompareEquality(parameters);
            case 'compare ordinals':
                return new CompareOrdinals(parameters);
            case 'boolean unary operator':
                return new BooleanUnaryOperator(parameters);
            case 'number unary operator':
                return new NumberUnaryOperator(parameters);
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
            case 'compare equality':
                return new CompareEquality(newParams);
            case 'compare ordinals':
                return new CompareOrdinals(newParams);
            case 'boolean unary operator':
                return new BooleanUnaryOperator(newParams);
            case 'number unary operator':
                return new NumberUnaryOperator(newParams);
            case 'boolean binary operator':
                return new BooleanBinaryOperator(newParams);
            case 'number binary operator':
                return new NumberBinaryOperator(newParams);
        }
    }
    static CreateBlock(obj: AmethystFunction, blockDiv: HTMLDivElement, view: GEODEView, project: Project, isRightType = true): AmethystBlock {
        switch(obj.type) {
            case 'none':
            default:
                return new DoNothingBlock(obj, blockDiv, view, project, isRightType);
            case 'chain':
                return new ChainBlock(obj, blockDiv, view, project, isRightType);
            case 'get variable':
                return new GetVariableBlock(obj, blockDiv, view, project, isRightType);
            case 'set variable':
                return new SetVariableBlock(obj, blockDiv, view, project, isRightType);
            case 'if':
                return new IfBlock(obj, blockDiv, view, project, isRightType);
            case 'if else':
                return new IfElseBlock(obj, blockDiv, view, project, isRightType);
            case 'key down':
                return new KeyDownBlock(obj, blockDiv, view, project, isRightType);
            case 'compare equality':
                return new CompareEqualityBlock(obj, blockDiv, view, project, isRightType);
            case 'compare ordinals':
                return new CompareOrdinalsBlock(obj, blockDiv, view, project, isRightType);
            case 'boolean unary operator':
                return new BooleanUnaryOperatorBlock(obj, blockDiv, view, project, isRightType);
            case 'number unary operator':
                return new NumberUnaryOperatorBlock(obj, blockDiv, view, project, isRightType);
            case 'boolean binary operator':
                return new BooleanBinaryOperatorBlock(obj, blockDiv, view, project, isRightType);
            case 'number binary operator':
                return new NumberBinaryOperatorBlock(obj, blockDiv, view, project, isRightType);
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
            case 'compare equality':
                return new RuntimeCompareEquality(obj, project);
            case 'compare ordinals':
                return new RuntimeCompareOrdinals(obj, project);
            case 'boolean unary operator':
                return new RuntimeBooleanUnaryOperator(obj, project);
            case 'number unary operator':
                return new RuntimeNumberUnaryOperator(obj, project);
            case 'boolean binary operator':
                return new RuntimeBooleanBinaryOperator(obj, project);
            case 'number binary operator':
                return new RuntimeNumberBinaryOperator(obj, project);
        }
    }
}