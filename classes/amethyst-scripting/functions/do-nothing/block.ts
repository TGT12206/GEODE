import { GEODEView } from "classes/geode-view";
import { AmethystBlock } from "../block";
import { DoNothing } from "./instance";

/**
 * This function type does nothing, and can be used to represent an empty slot
 * for parameters that must be functions.
 */
export class DoNothingBlock extends AmethystBlock {
    instance: DoNothing;
    
    /**
     * There are never parameters to remove
     */
    override RemoveParameter(): void { }

    override DisplayBlock(): void {
        this.div.empty();
        this.div.className = 'geode-script-block geode-do-nothing-block' + (this.isRightType ? '' : ' geode-type-mismatch');
    }
}