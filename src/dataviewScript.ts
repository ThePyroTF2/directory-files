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

const printDir = (dir) => {
    let string = '<ul>'
    for(const page in dir) {
		const path = dir[page].link.path.match(/(.*).md/)[1]
		const link = \`<a href="\${path}" class="internal-link" target="_blank" rel="noopener">\${path.split('/')[path.split('/').length - 1]}</a>\`
        if(dir[page].children != undefined) {
			string += \`<li class="folder">\${link}</li>\`
			
            string += printDir(dir[page].children)
        }
		else string += \`<li class="note">\${link}</li>\`
    }
    return string + '</ul>'
}

const directory = exploreFolder(dv.current().file.folder, dv.current().file.folder)
dv.paragraph(printDir(directory))
`

export default script
