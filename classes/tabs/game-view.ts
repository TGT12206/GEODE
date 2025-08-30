import { GEOD3ObjectHandler, GEOD3ObjectRI } from "./geod3-object";
import { Tab } from "./tab";

export class GameView extends Tab {
    static override icon = '▶️';
    gameDiv: HTMLDivElement;
    stillRunning: boolean;
    objects: GEOD3ObjectRI[];

    override async Focus(div: HTMLDivElement): Promise<void> {
        div.empty();
        div.className = 'geod3-game-view-main-div geod3-tab-container';
        const gameWrapper = div.createDiv('geod3-game-wrapper');
        this.gameDiv = gameWrapper.createDiv('geod3-game');
        this.stillRunning = true;
        this.objects = [];

        await this.OnStart();
        while (this.stillRunning) {
            this.OnNewFrame();
            await sleep(15);
        }
    }
    override UnFocus(div: HTMLDivElement): void | Promise<void> {
        div.empty();
        this.stillRunning = false;
    }

    private async OnStart() {
        const objInstances = this.anp.project.sceneView.objects;
        for (let i = 0; i < objInstances.length; i++) {
            this.objects.push(GEOD3ObjectHandler.CreateRI(objInstances[i], this.anp, this.gameDiv.createDiv()));
        }
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].OnStart();
        }
    }

    private async OnNewFrame() {
        const renderingOrder: GEOD3ObjectRI[] = [];
        for (let i = 0; i < this.objects.length; i++) {
            const currObj = this.objects[i];
            currObj.Render();
            this.PlaceIntoSpriteArray(renderingOrder, currObj);
        }
        for (let i = 0; i < renderingOrder.length; i++) {
            const currSprite = renderingOrder[i];
            currSprite.objDiv.style.zIndex = i + '';
        }
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].OnNewFrame();
        }
    }

    private PlaceIntoSpriteArray(arr: GEOD3ObjectRI[], newItem: GEOD3ObjectRI): void {
        let low = 0;
        let high = arr.length;

        const newZ = GEOD3ObjectHandler.GetVariable(newItem, 'z');
        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            const midZ = GEOD3ObjectHandler.GetVariable(arr[mid], 'z');
            if (midZ < newZ) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        arr.splice(low, 0, newItem);
    }
}