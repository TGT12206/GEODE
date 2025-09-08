import { AmethystStruct } from "../structs/struct";
import { AmethystFunction } from "./function";
import { AmethystStructHandler } from "../structs/struct-handler";
import { AmethystFunctionHandler } from "./function-handler";
import { Project } from "classes/project";
import { GEODEView } from "classes/geode-view";

/**
 * A class that actually implements the functionality of the corresponding
 * Amethyst function when the user opens the game view (runs the game).
 */
export abstract class AmethystRuntimeFunction {
    /**
     * The type of the function (see: AmethystFunction.knownTypes)
     */
    type: string;

    /**
     * A reference to the runtime parameters of the function
     */
    parameters: (AmethystStruct | AmethystRuntimeFunction)[];

    /**
     * A reference to the app (for vault access) and the project (for access to game information)
     */
    project: Project;

    /**
     * Carries out the behavior expected of this function type
     */
    abstract Execute(view: GEODEView): Promise<any>;

    constructor(ogFunction: AmethystFunction, project: Project) {
        this.type = ogFunction.type;
        this.parameters = [];
        this.project = project;

        /**
         * Creates a runtime instance (or copy, if value) of all the parameters.
         */
        for (let i = 0; i < ogFunction.parameters.length; i++) {
            const ogParam = ogFunction.parameters[i];
            let copy;
            if (ogParam instanceof AmethystStruct) {
                /**
                 * Because the only way to get variable references is via the get block (a function),
                 * we don't need to worry about getting variable references if the parameter is a struct.
                 */
                copy = AmethystStructHandler.Copy(ogParam);
            } else {
                copy = AmethystFunctionHandler.CreateRuntimeInstance(ogParam, project);
            }
            this.parameters.push(copy);
        }
    }
}
