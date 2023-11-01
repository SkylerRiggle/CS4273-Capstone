const vscode = require('vscode');
const { BARD_URL, BARD_KEY } = require("../config");
const axios = require("axios").default;

const BARD_COMMENT = RegExp(/#( )*bard:/gmi);

/**
 * Creates a sanitized and more robust version of the user's prompt
 * @param {string} userPrompt The user's original prompt
 * @param {string} fileText The current code in the file
 * @returns The sanitized and more robust version of the user's prompt
 */
const generatePrompt = (userPrompt, fileText) => `${userPrompt.replace(BARD_COMMENT, "").trim()}.
For context, here is the code so far: ${"```python" + fileText + "```"}
Use python, import any needed packages, include code comments where appropriate, and use explicit types.`;

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
    const prompt = line.text;
    if (!prompt.match(BARD_COMMENT))
    {
        return vscode.window.showErrorMessage('Input Was Not A Valid Bard Comment...');
    }

    // Send the prompt to the Bard API for generation
    vscode.window.showInformationMessage('Generating Response...');
    const response = await axios.post(
        `${BARD_URL}${BARD_KEY}`, {
            prompt: {
                text: generatePrompt(prompt, document.getText())
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