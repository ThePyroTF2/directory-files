# Directory Files

![Plugin version shield](https://img.shields.io/github/manifest-json/v/ThePyroTF2/directory-files) ![Plugin downloads shield](https://img.shields.io/github/downloads/ThePyroTF2/directory-files/total)

The Directory Files plugin automatically places and manages files in folders that act as directories. The main purpose of this is to grant the ability to create wikilinks to folders. Directory files display the tree of their parent directory to a customizable maximum depth. They use a DataviewJS script to ensure realtime updating of their contents. The tree uses a bulleted list with unique bullets for notes, folders, and empty folders (all three of which are customizable using the [style settings plugin](https://github.com/mgmeyers/obsidian-style-settings))

## Installation

Installation of the plugin is the same as any other. However, Directory Files is dependent upon [Dataview](https://github.com/blacksmithgu/obsidian-dataview), and **you must enable JavaScript queries in its settings for the directory files to display correctly.**

## Examples

<div align="center">
	<img alt="A basic example of the plugin in action" src="./img/Basic%20Demo.png">
	<br>
	<img alt="The filesystem corresponding to the above directory file" src="./img/Basic%20Demo%20Filesystem.png">
	<br>
	<br>
	<img alt="An example of the maximum depth setting" src="./img/Max%20Depth%20Demo.png">
	<br>
	<img alt="The filesystem corresponding to the above directory file" src="./img/Max%20Depth%20Demo%20Filsystem.png">
	<br>
	<br>
	<img alt="An example of the custom icon settings" src="./img/Custom%20Icons%20Demo.png">
	<br>
	<img alt="The filesystem corresponding to the above directory file" src="./img/Custom%20Icons%20Demo%20Filesystem.png">
</div>

## Future plans

-   The user has to manually index any pre-existing folders on plugin install (with the push of a button. However, they still have to go into the settings to do so). I want to add a pop-up to prompt the user to do this on the plugin's first load.
-   I want to add an option to open a directory file when you open its corresponding folder.
