const vscode = require('vscode');

/**
 * Handles the generation of a python for loop.
 * @param {vscode.TextDocument} document 
 * @param {vscode.Selection | vscode.Range} range 
 */
const run = async (document, range) =>
{
    vscode.window.showInformationMessage('For loop generated!'); // Example notification
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const selection = editor.selection;
        const cursorPosition = selection.active;

        // Get the line content where the cursor is
        const line = document.lineAt(cursorPosition.line).text;

        const lineLength = range.end.line + 1; // Calculate the line below the range's end position
        const newPosition = new vscode.Position(lineLength, 0); // Create a new position at the beginning of the line

        // Use a regular expression to extract variable name, type, and value
        const variableRegex = /\b(\w+)\s*=\s*([^#]+)/;
        // Modify this regex as per your code's conventions
        const match = line.match(variableRegex);

        if (match) {
            const variableName = match[1];
            const variableValue = match[2].trim(); // Remove leading and trailing whitespaces

            // Determine the variable type based on the value
            let variableType;
            if (/^\d+(\.\d+)?$/.test(variableValue)) {
                variableType = 'number';
            } else if (variableValue.startsWith('[') && variableValue.endsWith(']')) {
                variableType = 'list';
            } else if (variableValue.startsWith("'") || variableValue.startsWith('"')) {
                variableType = 'string';
            } else {
                variableType = 'unknown';
            }

            // For testing
            console.log(`Variable Name: ${variableName}`);
            console.log(`Variable Value: ${variableValue}`);
            console.log(`Variable Type: ${variableType}`);
            
            // Determine how to create a for loop based on data type
            let forLoopText;
            if (variableType == 'list') {
                forLoopText = `\nfor ${variableName}_item in ${variableName}:\n\t# Insert code here\n`;
            }
            else if (variableType == 'string') {
                forLoopText = `\nfor char in ${variableName}:\n\t# Insert code here\n`;
            }
            else if (variableType == 'number') {
                forLoopText = `\nfor i in range(0, ${variableValue}):\n\t# Insert code here\n`;
            }
            else {

            }

            editor.edit((editBuilder) => {
                editBuilder.insert(newPosition, forLoopText); // Insert text and a newline character
            });
        }
    }
}

module.exports = {
    title: "Generate For Loop",
    description: "Create for Loop",
    funcName: "generateForLoop",
    run: (
        /** @type {vscode.TextDocument} */ document,
        /** @type {vscode.Range | vscode.Selection} */ range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run(document, range)
};