import { App, PluginSettingTab, Setting } from 'obsidian'
import DirectoryFilesPlugin from './main'

export interface PluginSettings {
	maxDepth: number
	// notesIcon: string
	// foldersIcon: string
}

export const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	maxDepth: 2
	// notesIcon: '📝',
	// foldersIcon: '📁'
}

export class DirectoryFilesSettingTab extends PluginSettingTab {
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
		// new Setting(containerEl)
		// 	.setName('Notes Icon')
		// 	.setDesc('Icon to use for notes')
		// 	.addText((text) => {
		// 		text.setValue(this.plugin.settings.notesIcon).onChange(
		// 			async (value: string) => {
		// 				this.plugin.settings.notesIcon = value
		// 				await this.plugin.saveSettings()
		// 			}
		// 		)
		// 	})
		// new Setting(containerEl)
		// 	.setName('Folders Icon')
		// 	.setDesc('Icon to use for folders')
		// 	.addText((text) => {
		// 		text.setValue(this.plugin.settings.foldersIcon).onChange(
		// 			async (value: string) => {
		// 				this.plugin.settings.foldersIcon = value
		// 				await this.plugin.saveSettings()
		// 			}
		// 		)
		// 	})
		new Setting(containerEl).addButton((button) => {
			button
				.setButtonText('Refresh directory files')
				.onClick(async () => {
					await this.plugin.refreshDirectoryFiles()
				})
		})
	}
}
