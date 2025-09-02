import { GEODEView, VIEW_TYPE_GEODE_PROJECT } from 'classes/geode-view';
import { App, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

/**
 * For anyone reading this code, here's a quick layout:
 * 
 * In the view for this plugin, there are 4 "tabs".
 * - the File Manager: Accesses and stores files to a project folder that was specified by the user.
 * - the Scene View: Allows users to create new objects, add variables to those objects, and initialize those variables.
 * - the Script Editor: Allows users to edit scripts on their objects using a block based scripting language (I'm calling it Amethyst)
 * - the Game View: Runs the game created by the user
 * 
 * Behind the scenes (Amethyst):
 * - Structs: Structs are the variables that can be used by users in their scripts
 * 		(or the plugin, in the case of default variables). They hold values and nothing more,
 * 		no functions within them or subclasses or anything. Think of them as primitive types.
 * - Functions: Functions are the blocks that can be used by users to write their scripts.
 * - Scripts (Clusters/Hooks): On Start/On New Frame are clusters where the user can add blocks.
 *		If an object has more than 1 cluster of the same type, they are called asynchronously
 * 		when their corresponding event happens.
 * - Objects: Objects have a set of default variables, and users can add more.
 * 		The values set by the user are the ones used at the start of the game.
 */

/**
 * Settings for the GEODE plugin
 */
interface GEODESettings {
	/**
	 * The vault path to automatically fill in for the project path.
	 * 
	 * You can have more than one project in a vault.
	 */
	defaultProjectPath: string;
}

const DEFAULT_SETTINGS: GEODESettings = {
	defaultProjectPath: 'New GEODE Project'
}

/**
 * GEODE stands for Game Engine for Open Development by Everyone...or whatever you want it to stand for.
 */
export default class GEODE extends Plugin {
	settings: GEODESettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			VIEW_TYPE_GEODE_PROJECT,
			(leaf) => new GEODEView(leaf, this.settings.defaultProjectPath)
		);

		this.addRibbonIcon('boxes', 'Open GEODE', () => {
			this.activateView(VIEW_TYPE_GEODE_PROJECT);
		});

		this.addCommand({
			id: 'open-geode-view',
			name: 'Open GEODE',
			callback: () => {
				this.activateView(VIEW_TYPE_GEODE_PROJECT);
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new GEODESettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	activateView(view_type: string) {
		let leaf: WorkspaceLeaf | null = null;

		leaf = this.app.workspace.getLeaf('tab');
		if (leaf === null) {
			new Notice("Failed to create view: workspace leaf was null");
			return;
		}
		leaf.setViewState({ type: view_type, active: true });
	}
}

class GEODESettingTab extends PluginSettingTab {
	plugin: GEODE;

	constructor(app: App, plugin: GEODE) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Default Project Folder')
			.setDesc('The vault path to automatically fill in for the project path. You can have more than one project in a vault.')
			.addText(text => text
				.setPlaceholder('Default Project Path')
				.setValue(this.plugin.settings.defaultProjectPath)
				.onChange(async (value) => {
					this.plugin.settings.defaultProjectPath = value;
					await this.plugin.saveSettings();
				}));
	}
}
