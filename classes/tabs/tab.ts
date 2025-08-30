import { AppAndProject } from "classes/project";

export abstract class Tab {
    static icon: string;
    anp: AppAndProject;
    /**
     * @param anp a reference to the obsidian app to read and write files as well as the geod3 project this tab should look at
     */
    constructor(anp: AppAndProject) {
        this.anp = anp;
    }

    /**
     * Open (focus on) the tab
     * @param div the main div of the view
     */
    abstract Focus(div: HTMLDivElement): void | Promise<void>;
    
    /**
     * Unfocus this tab before focusing on another one.
     * This prevents things happening in the background while the user isn't looking,
     * or just pausing loops
     * @param div the main div of the view
     */
    abstract UnFocus(div: HTMLDivElement): void | Promise<void>;
}