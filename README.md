# CS4273-Capstone
Github repo for CS4273 Capstone course project.

## Downloading the extension

In the extensions panel in VSCode, select the three dots in the top-right of the panel, then select "Install from vsix".
Then naviagte your filesystem to find the _Install.vsix_ file in the capstone folder of the directory.
Once that's finished, you now have our python extension installed!

## Running in a TEST environment

To run the project, first enter into the capstone directory, then enter the command:
```command
npm install
```

You will also need to configure the BARD API environment variable. To do this, create a new document in the capstone directory titled _config.js_.
Once this file has been created, add the following contents (Note: for a full-fledged project, the API key would not be made public):
```js
module.exports = {
    BARD_URL: "https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=",
    BARD_KEY: "AIzaSyBqMhkS25nLgLS-KxFWMpv-NmoRhLKfKXw",
};
```
Once you've completed this, simply open the _extension.js_ file and run the test environment by pressing F5.
