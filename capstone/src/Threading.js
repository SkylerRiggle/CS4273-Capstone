const vscode = require('vscode');

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

            const lineLength = document.lineCount + 1; // Calculate the line below the range's end position
            const newPosition = new vscode.Position(lineLength, 0); // Create a new position at the beginning of the line
            const topPosition = new vscode.Position(0,0);

            // Use a regular expression to extract variable name, type, and value
            const variableRegex = /\b\w*\(\w*\):/;
            // Modify this regex as per your code's conventions
            const match = line.match(variableRegex);

            if (match) {
                const variableName = match[0].split("(")[0];


                // For testing
                console.log(`Variable Name: ${variableName}`);
                
                // Determine how to create a for loop based on data type
                let importThread = "import threading"
                let threadText = "threading.Thread(target=" + variableName + ",args=()).start()"

                editor.edit((editBuilder) => {
                    editBuilder.insert(topPosition, importThread);
                    editBuilder.insert(newPosition, threadText); // Insert text and a newline character
                });
            }
        }
}

module.exports = {
    title: "Generate Thread",
    description: "Create thread",
    funcName: "generateThread",
    run: (
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.TextDocument} */ document,
        /** @type {vscode.Range | vscode.Selection} */ range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run(range)
};