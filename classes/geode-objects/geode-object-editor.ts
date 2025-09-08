import { AmethystStructHandler } from "classes/amethyst-scripting/structs/struct-handler";
import { GEODEObject } from "./geode-object";
import { AmethystStruct } from "classes/amethyst-scripting/structs/struct";
import { Project } from "classes/project";
import { GEODEView } from "classes/geode-view";

export class GEODEObjectEditor {
    instance: GEODEObject;
    
    constructor(instance: GEODEObject, view: GEODEView, project: Project, div: HTMLDivElement) {
        this.instance = instance;
        div.empty();
        const nameDiv = div.createDiv('geode-inspector-top-bar hbox');
        nameDiv.createEl('div', { text: this.instance.idInScene + ':' } );
        const nameInput = nameDiv.createEl('input', { type: 'text', value: this.instance.name } );
        const editScriptsButton = nameDiv.createEl('button', { text: 'Edit Scripts📜' } );
        editScriptsButton.className = 'geode-secondary-button';
        nameInput.onchange = () => {
            this.instance.name = nameInput.value;
        }
        editScriptsButton.onclick = () => {
            project.scriptEditor.currentObject = this.instance;
            project.SwitchToTab(project.scriptEditorTabID);
        }
        const variablesDiv = div.createDiv('geode-inspector-variable-list vbox');
        for (let i = 0; i < this.instance.variables.length; i++) {
            const variable = this.instance.variables[i];
            const varDiv = variablesDiv.createDiv('geode-inspector-variable hbox');
            varDiv.createEl('div', { text: variable.name } );
            AmethystStructHandler.CreateEditor(variable, varDiv.createDiv(), view);
        }
        const addNewDiv = div.createDiv('geode-inspector-new-var hbox');

        const variableNameInput = addNewDiv.createEl('input', { type: 'text', value: 'unnamed' } );
        const variableTypeInput = addNewDiv.createEl('select');
        const addVariableButton = addNewDiv.createEl('button', { text: '+' } );

        addVariableButton.className = 'geode-add-button';

        for (let i = 1; i < AmethystStruct.knownTypes.length; i++) {
            const type = AmethystStruct.knownTypes[i];
            variableTypeInput.createEl('option', { text: type, value: i + '' } );
        }
        variableTypeInput.value = '1';

        addVariableButton.onclick = () => {
            const name = variableNameInput.value;
            for (let i = 0; i < this.instance.variables.length; i++) {
                if (this.instance.variables[i].name === name) {
                    return;
                }
            }
            const newVar = AmethystStructHandler.Create(variableTypeInput.value, undefined, name);
            this.instance.variables.push(newVar);
            const newVarDiv = variablesDiv.createDiv('geode-inspector-variable hbox');
            newVarDiv.createEl('div', { text: newVar.name } );
            AmethystStructHandler.CreateEditor(newVar, newVarDiv, view);
        }
    }
}