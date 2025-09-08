import { GEODEView } from "classes/geode-view";
import { Project } from "classes/project";

export abstract class Tab {
    static icon: string;
    project: Project;

    constructor(project: Project) {
        this.project = project;
    }

    /**
     * Open (focus on) the tab
     * @param div the main div of the view
     */
    abstract Focus(div: HTMLDivElement, view: GEODEView): Promise<void>;
    
    /**
     * Unfocus this tab before focusing on another one.
     * This prevents things happening in the background while the user isn't looking,
     * or just pausing loops
     * @param div the main div of the view
     */
    abstract UnFocus(div: HTMLDivElement, view: GEODEView): Promise<void>;
}