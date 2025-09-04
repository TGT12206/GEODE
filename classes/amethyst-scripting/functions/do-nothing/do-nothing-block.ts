import { GEODEView } from "classes/geode-view";
import { AmethystBlock } from "../block";
import { DoNothing } from "./do-nothing";

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

    override DisplayBlock(view: GEODEView): void {
        super.DisplayBlock(view);
        this.div.classList.add('geode-do-nothing-block');
    }
}