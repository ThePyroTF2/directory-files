import { Plugin, TAbstractFile, TFile, TFolder } from 'obsidian'
import * as settings from './settings'

export default class DirectoryFilesPlugin extends Plugin {
	settings: settings.PluginSettings

	async onload() {
		await this.loadSettings()

		this.registerEvent(
			this.app.vault.on('create', this.onCreate.bind(this))
		)
		this.registerEvent(
			this.app.vault.on('rename', this.onRename.bind(this))
		)

		this.addSettingTab(
			new settings.DirectoryFilesSettingTab(this.app, this)
		)
	}

	async onCreate(file: TAbstractFile) {
		if (!(file instanceof TFolder)) return
		const folder = file as TFolder
		await this.createDirectoryFile.bind(this)(folder)
	}

	async createDirectoryFile(folder: TFolder) {
		const script = `
const exploreFolder = (ParentDir, DirToExplore) => { let output = {}
	let children = dv.pages(\`"\${DirToExplore}"\`).file.values.sort()
	for(const page of children) {
		let pageParentFolder = page.folder.split('/')[page.folder.split('/').length - 1]
		if(page.name != pageParentFolder && page.frontmatter?.tag != 'directory' && page.folder.split('/').length == DirToExplore.split('/').length) {
			output[page.name] = {}
			output[page.name].link = dv.fileLink(page.path, false, page.name)
		}
		if(page.name == pageParentFolder && page.frontmatter?.tag == 'directory' && page.folder.split('/').length == DirToExplore.split('/').length + 1) {
			let dir = page.folder.split('/')
			let dirName = dir[dir.length - 1]
			output[dirName] = {}
			output[dirName].link = dv.fileLink(page.path, false, dirName)
			output[dirName].children = exploreFolder(DirToExplore, page.folder)
		}
	}
		
	return output
}

const printDir = (dir, depth = 0) => {
	if(depth > ${this.settings.maxDepth}) return ''
	let string = '<ul>'
	for(const page in dir) {
		const path = dir[page].link.path.match(/(.*).md/)[1]
		const link = \`<a href="\${path}" class="internal-link" target="_blank" rel="noopener">\${path.split('/')[path.split('/').length - 1]}</a>\`
		if(dir[page].children) {
			string += \`<li class="\${Object.keys(dir[page].children).length > 0 ? 'folder' : 'empty-folder'}">\${link}</li>\`

			string += printDir(dir[page].children, depth + 1)
		}
		else string += \`<li class="note">\${link}</li>\`
	}
	return string + '</ul>'
}

const directory = exploreFolder(dv.current().file.folder, dv.current().file.folder)
dv.paragraph(printDir(directory))
`

		await this.app.vault.create(
			`${folder.path}/${folder.name}.md`,
			'---\ntag: directory\n---\n# `= this.file.folder` Directory\n```dataviewjs' +
				script +
				'```'
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

	async loadSettings() {
		this.settings = Object.assign(
			{},
			settings.DEFAULT_SETTINGS,
			await this.loadData()
		)
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}

	async refreshDirectoryFiles() {
		for (const f of this.app.vault.getAllLoadedFiles()) {
			if (!(f instanceof TFolder)) continue
			const folder = f as TFolder
			if (folder.isRoot()) continue

			const directoryFiles: TFile[] = []
			for (const f of folder.children) {
				if (!(f instanceof TFile)) continue
				const file = f as TFile

				if (file.extension !== 'md') continue
				if (file.name == folder.name + '.md') {
					directoryFiles.push(file)
				}
			}

			if (directoryFiles.length == 0) {
				await this.createDirectoryFile.bind(this)(folder)
				continue
			}
			if (directoryFiles.length == 1) {
				await this.app.vault.delete(directoryFiles[0])
				await this.createDirectoryFile.bind(this)(folder)
				continue
			}
		}
	}
}
