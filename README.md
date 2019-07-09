# Phaldrin

Phaldrin is a fantasy map route calculator.

## Requirements

For development, you will only need Node.js installed in your environement. Node.js comes with NPM.

### Node
- #### Node installation on Windows

Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu
You can install nodejs and npm easily with apt install, just run the following commands.

	$ sudo apt install nodejs
	$ sudo apt install npm

- #### Other Operating Systems
You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

	node --version
	v[CURRENT]

	npm --version
	[CURRENT]

## Initializing

The following commands will clone the repo to your local machine and install all needed NPM packages.

	git clone https://github.com/ditmarvisser/phaldrin
	cd phaldrin
	npm install

## Running the project
This command will start a live-server and open it in your browser. When you save a js or html file it will automatically reload the webpage.

	npm start

## Simple build for production
This command will build a bundle.js and index.html, which will be put in the dist folder.

	npm run build


## Versioning

We use [SemVer](http://semver.org/) for versioning. Some day I think. 

## Authors

* **Ditmar Visser** - *Initial work* - [Ditmar Visser](https://github.com/ditmarvisser)

See also the list of [contributors](https://github.com/ditmarvisser/phaldrin/contributors) who participated in this project.

## Acknowledgments

* Thanks to Jonas Schmeddman for creating the Udemy courses I followed
* Thanks to Neyala for being a cool human
