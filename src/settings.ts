import { App, PluginSettingTab, Setting } from 'obsidian'
import DirectoryFilesPlugin from './main'

export interface PluginSettings {
	maxDepth: number
}

export const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	maxDepth: 2
}

export class DirectoryFilesSettingsTab extends PluginSettingTab {
	plugin: DirectoryFilesPlugin

	constructor(app: App, plugin: DirectoryFilesPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display() {
		const { containerEl } = this

		containerEl.empty()

		new Setting(containerEl)
			.setName('Max Depth')
			.setDesc('Maximum depth of the directory tree')
			.addSlider((slider) => {
				slider
					.setValue(this.plugin.settings.maxDepth)
					.setLimits(0, 10, 1)
					.onChange(async (value: number) => {
						this.plugin.settings.maxDepth = value
						await this.plugin.saveSettings()
						this.plugin.refreshDirectoryFiles()
					})
			})
		new Setting(containerEl).addButton((button) => {
			button
				.setButtonText('Refresh directory files')
				.onClick(async () => {
					await this.plugin.refreshDirectoryFiles()
				})
		})
	}
}
