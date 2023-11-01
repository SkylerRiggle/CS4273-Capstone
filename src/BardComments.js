const vscode = require('vscode');
const axios = require("axios").default;

const BARD_URL = "https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=";
const BARD_KEY = "AIzaSyBqMhkS25nLgLS-KxFWMpv-NmoRhLKfKXw";

const BARD_COMMENT = "# BARD:";
const PROMPT_ADDON = "Use python, import any needed packages, include code comments as needed, and use explicit types.";

/**
 * Generates some code based on the user's input prompt
 * @param {vscode.TextDocument} document 
 */
const run = async (document) =>
{
    // Get the currently active editor
    const editor = vscode.window.activeTextEditor;
    if (!editor)
    {
        return vscode.window.showErrorMessage('Editor Not Found...');
    }

    // Ensure that the line in question is a bard command
    const line = document.lineAt(editor.selection.active);
    let prompt = line.text.trim();
    if (!prompt.startsWith(BARD_COMMENT))
    {
        return vscode.window.showErrorMessage('Input Was Not A Valid Bard Comment...');
    }

    // Send the prompt to the Bard API for generation
    vscode.window.showInformationMessage('Generating Response...');
    const response = await axios.post(
        `${BARD_URL}${BARD_KEY}`, {
            prompt: {
                text: `${prompt.replace(BARD_COMMENT, "")}.\n${PROMPT_ADDON}`
            },
            maxOutputTokens: 5000
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
    if (!response.data)
    {
        return vscode.window.showErrorMessage('Error Generating Code With Bard API...');
    }

    /** @type {string} */
    const code = response.data.candidates[0].output;

    // Insert the code into the file in place of the comment
    editor.edit((editBuilder) => {
        editBuilder.replace(
            line.range,
            code.replace("```python", "").replace(/\n```(.*)/gms, "").trim()
        );
    });
    vscode.window.showInformationMessage('Code Successfully Generated!');
}

module.exports = {
    title: "Generate Code With Bard API",
    description: "Generate Code With Bard",
    funcName: "generateBardCode",
    run: (
        /** @type {vscode.TextDocument} */ document,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.Range | vscode.Selection} */ _range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run(document)
};