import { GEOD3View, VIEW_TYPE_GEOD3_PROJECT } from 'classes/geod3-view';
import { App, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

/**
 * GEO:D3 stands for Game Engine in Obsidian: Developed by 3rd-party.
 */
interface GEOD3Settings {
	projectPath: string;
}

const DEFAULT_SETTINGS: GEOD3Settings = {
	projectPath: 'New GEOD3 Project'
}

export default class GEOD3 extends Plugin {
	settings: GEOD3Settings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			VIEW_TYPE_GEOD3_PROJECT,
			(leaf) => new GEOD3View(leaf, this.settings.projectPath)
		);

		this.addRibbonIcon('boxes', 'Open GEOD3', () => {
			this.activateView(VIEW_TYPE_GEOD3_PROJECT);
		});

		this.addCommand({
			id: 'open-geod3-view',
			name: 'Open GEOD3',
			callback: () => {
				this.activateView(VIEW_TYPE_GEOD3_PROJECT);
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
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

class SampleSettingTab extends PluginSettingTab {
	plugin: GEOD3;

	constructor(app: App, plugin: GEOD3) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Default Project Folder')
			.setDesc('The vault path to automatically fill in for the project path')
			.addText(text => text
				.setPlaceholder('Default Source Path')
				.setValue(this.plugin.settings.projectPath)
				.onChange(async (value) => {
					this.plugin.settings.projectPath = value;
					await this.plugin.saveSettings();
				}));
	}
}
