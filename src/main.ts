import { Plugin, TAbstractFile, TFile, TFolder } from 'obsidian'

export default class DirectoryFilesPlugin extends Plugin {
	onload() {
		this.registerEvent(
			this.app.vault.on('create', this.onCreate.bind(this))
		)
		this.registerEvent(
			this.app.vault.on('rename', this.onRename.bind(this))
		)
	}

	async onCreate(file: TAbstractFile) {
		if (!(file instanceof TFolder)) return
		const folder = file as TFolder
		await this.createDirectoryFile.bind(this)(folder)
	}

	async createDirectoryFile(folder: TFolder) {
		await this.app.vault.create(
			`${folder.path}/${folder.name}.md`,
			'---\ntag: directory\n---'
		)
	}

	async onRename(file: TAbstractFile) {
		if (!(file instanceof TFolder)) return
		const folder = file as TFolder
		await this.renameDirectoryFile.bind(this)(folder)
	}

	async renameDirectoryFile(folder: TFolder) {
		const directoryFiles: TFile[] = []
		for (const f of folder.children) {
			if (!(f instanceof TFile)) continue
			const file = f as TFile
			if (file.extension !== 'md') continue
			if (
				app.metadataCache.getFileCache(file)?.frontmatter?.tag ==
				'directory'
			) {
				directoryFiles.push(file)
			}
		}

		if (directoryFiles.length == 0) {
			// createDirectoryFile functions as expected
			await this.createDirectoryFile.bind(this)(folder)
			return
		}
		if (directoryFiles.length == 1) {
			const file = directoryFiles[0]
			await this.app.fileManager.renameFile(
				file,
				`${folder.path}/${folder.name}.md`
			)
		}
	}
}
