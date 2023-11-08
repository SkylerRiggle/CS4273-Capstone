const vscode = require('vscode');

let threadFunc = ""

const getThreadFunc = () => threadFunc;

/**
 * Handles the generation of a python for loop.
 * @param {vscode.Selection | vscode.Range} range 
 */
const run = async (range) =>
{
    vscode.window.showInformationMessage('For loop generated!'); // Example notification
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const cursorPosition = selection.active;

            // Get the line content where the cursor is
            const line = document.lineAt(cursorPosition.line).text;

            // Use a regular expression to extract variable name, type, and value
            const variableRegex = /\b\w*\(\w*\):/;
            // Modify this regex as per your code's conventions
            const match = line.match(variableRegex);

            if (match) {
                const variableName = match[0].split("(")[0];

                // For testing
                console.log(`Variable Name: ${variableName}`);
                
                threadFunc = variableName;
                
            }
        }
}

module.exports = {
    title: "Set Threading Function",
    description: "Set Threading Function",
    funcName: "setThreadFunc",
    run: (
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.TextDocument} */ document,
        /** @type {vscode.Range | vscode.Selection} */ range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run(range),
        getThreadFunc:getThreadFunc
};