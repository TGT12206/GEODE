import { GEODERuntimeObject } from "classes/geode-objects/geode-runtime-object";
import { Tab } from "./tab";
import { KeyDown } from "classes/amethyst-scripting/functions/key-down/instance";
import { GEODEObjectHandler } from "classes/geode-objects/geode-object-handler";
import { GEODEView } from "classes/geode-view";

export class GameView extends Tab {
    static override icon = '▶️';
    gameDiv: HTMLDivElement;
    stillRunning: boolean;
    objects: GEODERuntimeObject[];
    pressedKeys: Map<string, boolean>;
    get pressedKeysArray(): [string, boolean][] {
        return Array.from(this.pressedKeys.entries());
    }

    override async Focus(div: HTMLDivElement, view: GEODEView): Promise<void> {
        div.empty();
        div.className = 'geode-game-view-main-div geode-tab-container';
        const gameWrapper = div.createDiv('geode-game-wrapper');
        this.gameDiv = gameWrapper.createDiv('geode-game');
        this.stillRunning = true;
        this.objects = [];
        this.pressedKeys = new Map();

        this.ListenForKeyPresses(view);

        await this.OnStart(view);
        while (this.stillRunning) {
            this.OnNewFrame(view);
            await sleep(15);
        }
    }
    override async UnFocus(div: HTMLDivElement): Promise<void> {
        div.empty();
        this.stillRunning = false;
    }

    private ListenForKeyPresses(view: GEODEView) {
        this.gameDiv.tabIndex = -1;
        this.gameDiv.focus();

        const keyList = KeyDown.keylist;
        for (let i = 0; i < keyList.length; i++) {
            const currKey = keyList[i];
            this.pressedKeys.set(currKey, false);
        }

        view.registerDomEvent(this.gameDiv, 'keydown', (event) => {
            this.pressedKeys.set('Any', true);
            switch (event.key) {
                case ' ':
                    this.pressedKeys.set('Space', true);
                    return;
                case 'ArrowUp':
                    this.pressedKeys.set('Up Arrow', true);
                    return;
                case 'ArrowDown':
                    this.pressedKeys.set('Down Arrow', true);
                    return;
                case 'ArrowLeft':
                    this.pressedKeys.set('Left Arrow', true);
                    return;
                case 'ArrowRight':
                    this.pressedKeys.set('Right Arrow', true);
                    return;
                case 'A':
                case 'a':
                    this.pressedKeys.set('A', true);
                    return;
                case 'B':
                case 'b':
                    this.pressedKeys.set('B', true);
                    return;
                case 'C':
                case 'c':
                    this.pressedKeys.set('C', true);
                    return;
                case 'D':
                case 'd':
                    this.pressedKeys.set('D', true);
                    return;
                case 'E':
                case 'e':
                    this.pressedKeys.set('E', true);
                    return;
                case 'F':
                case 'f':
                    this.pressedKeys.set('F', true);
                    return;
                case 'G':
                case 'g':
                    this.pressedKeys.set('G', true);
                    return;
                case 'H':
                case 'h':
                    this.pressedKeys.set('H', true);
                    return;
                case 'I':
                case 'i':
                    this.pressedKeys.set('I', true);
                    return;
                case 'J':
                case 'j':
                    this.pressedKeys.set('J', true);
                    return;
                case 'K':
                case 'k':
                    this.pressedKeys.set('K', true);
                    return;
                case 'L':
                case 'l':
                    this.pressedKeys.set('L', true);
                    return;
                case 'M':
                case 'm':
                    this.pressedKeys.set('M', true);
                    return;
                case 'N':
                case 'n':
                    this.pressedKeys.set('N', true);
                    return;
                case 'O':
                case 'o':
                    this.pressedKeys.set('O', true);
                    return;
                case 'P':
                case 'p':
                    this.pressedKeys.set('P', true);
                    return;
                case 'Q':
                case 'q':
                    this.pressedKeys.set('Q', true);
                    return;
                case 'R':
                case 'r':
                    this.pressedKeys.set('R', true);
                    return;
                case 'S':
                case 's':
                    this.pressedKeys.set('S', true);
                    return;
                case 'T':
                case 't':
                    this.pressedKeys.set('T', true);
                    return;
                case 'U':
                case 'u':
                    this.pressedKeys.set('U', true);
                    return;
                case 'V':
                case 'v':
                    this.pressedKeys.set('V', true);
                    return;
                case 'W':
                case 'w':
                    this.pressedKeys.set('W', true);
                    return;
                case 'X':
                case 'x':
                    this.pressedKeys.set('X', true);
                    return;
                case 'Y':
                case 'y':
                    this.pressedKeys.set('Y', true);
                    return;
                case 'Z':
                case 'z':
                    this.pressedKeys.set('Z', true);
                    return;
            }
        });

        view.registerDomEvent(this.gameDiv, 'keyup', (event) => {
            switch (event.key) {
                case ' ':
                    this.pressedKeys.set('Space', false);
                    break;
                case 'ArrowUp':
                    this.pressedKeys.set('Up Arrow', false);
                    break;
                case 'ArrowDown':
                    this.pressedKeys.set('Down Arrow', false);
                    break;
                case 'ArrowLeft':
                    this.pressedKeys.set('Left Arrow', false);
                    break;
                case 'ArrowRight':
                    this.pressedKeys.set('Right Arrow', false);
                    break;
                case 'A':
                case 'a':
                    this.pressedKeys.set('A', false);
                    break;
                case 'B':
                case 'b':
                    this.pressedKeys.set('B', false);
                    break;
                case 'C':
                case 'c':
                    this.pressedKeys.set('C', false);
                    break;
                case 'D':
                case 'd':
                    this.pressedKeys.set('D', false);
                    break;
                case 'E':
                case 'e':
                    this.pressedKeys.set('E', false);
                    break;
                case 'F':
                case 'f':
                    this.pressedKeys.set('F', false);
                    break;
                case 'G':
                case 'g':
                    this.pressedKeys.set('G', false);
                    break;
                case 'H':
                case 'h':
                    this.pressedKeys.set('H', false);
                    break;
                case 'I':
                case 'i':
                    this.pressedKeys.set('I', false);
                    break;
                case 'J':
                case 'j':
                    this.pressedKeys.set('J', false);
                    break;
                case 'K':
                case 'k':
                    this.pressedKeys.set('K', false);
                    break;
                case 'L':
                case 'l':
                    this.pressedKeys.set('L', false);
                    break;
                case 'M':
                case 'm':
                    this.pressedKeys.set('M', false);
                    break;
                case 'N':
                case 'n':
                    this.pressedKeys.set('N', false);
                    break;
                case 'O':
                case 'o':
                    this.pressedKeys.set('O', false);
                    break;
                case 'P':
                case 'p':
                    this.pressedKeys.set('P', false);
                    break;
                case 'Q':
                case 'q':
                    this.pressedKeys.set('Q', false);
                    break;
                case 'R':
                case 'r':
                    this.pressedKeys.set('R', false);
                    break;
                case 'S':
                case 's':
                    this.pressedKeys.set('S', false);
                    break;
                case 'T':
                case 't':
                    this.pressedKeys.set('T', false);
                    break;
                case 'U':
                case 'u':
                    this.pressedKeys.set('U', false);
                    break;
                case 'V':
                case 'v':
                    this.pressedKeys.set('V', false);
                    break;
                case 'W':
                case 'w':
                    this.pressedKeys.set('W', false);
                    break;
                case 'X':
                case 'x':
                    this.pressedKeys.set('X', false);
                    break;
                case 'Y':
                case 'y':
                    this.pressedKeys.set('Y', false);
                    break;
                case 'Z':
                case 'z':
                    this.pressedKeys.set('Z', false);
                    break;
            }
            const pressedKeysArray = this.pressedKeysArray;
            for (let i = 1; i < pressedKeysArray.length; i++) {
                if (pressedKeysArray[i][1]) {
                    return;
                }
            }
            this.pressedKeys.set('Any', false);
        });
    }

    private async OnStart(view: GEODEView) {
        const objInstances = this.project.sceneView.objects;
        for (let i = 0; i < objInstances.length; i++) {
            this.objects.push(GEODEObjectHandler.CreateRuntimeObject(objInstances[i], this.project, this.gameDiv.createDiv()));
        }
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].OnStart(view);
        }
    }

    private async OnNewFrame(view: GEODEView) {
        this.gameDiv.focus();
        const renderingOrder: GEODERuntimeObject[] = [];
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
            this.objects[i].OnNewFrame(view);
        }
    }

    private PlaceIntoSpriteArray(arr: GEODERuntimeObject[], newItem: GEODERuntimeObject): void {
        let low = 0;
        let high = arr.length;

        const newZ = GEODEObjectHandler.GetVariable(newItem, 'z');
        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            const midZ = GEODEObjectHandler.GetVariable(arr[mid], 'z');
            if (midZ < newZ) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        arr.splice(low, 0, newItem);
    }
}