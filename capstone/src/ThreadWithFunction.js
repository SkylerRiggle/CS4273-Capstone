const vscode = require('vscode');


const threadFuncFile = require("./SetThreadingFunction")


/**
 * Handles the generation of a python for loop.
 * @param {vscode.Selection | vscode.Range} range 
 */
const run = async (range) =>
{
    const threadFunc = threadFuncFile.getThreadFunc()

    vscode.window.showInformationMessage('For loop generated!'); // Example notification
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const cursorPosition = selection.active;

            // Get the line content where the cursor is
            const line = document.lineAt(cursorPosition.line).text;

            const lineLength = range.end.line + 1; // Calculate the line below the range's end position
            const newPosition = new vscode.Position(document.lineCount + 1, 0); // Create a new position at the beginning of the line
            const topPosition = new vscode.Position(0,0);

            // Use a regular expression to extract variable name, type, and value
            const variableRegex = /\b(\w+)\s*=\s*([^#]+)/;
            const importThread = "import threading";
            let hasImport = false;
            // Modify this regex as per your code's conventions
            const match = line.match(variableRegex);

            for (let i = 0; i < document.lineCount; i++){
                let currPosition = document.lineAt(i).text;
                if (currPosition.match(importThread)){
                    hasImport = true;
                }
            }

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
                    forLoopText = "\nfor "+variableName+"_item in "+variableName+":\n\tthreading.Thread(target=" + threadFunc + ",args=["+variableName+"_item,]).start()\n";
                }
                else if (variableType == 'string') {
                    forLoopText = "\nfor char in "+variableName+":\n\tthreading.Thread(target=" + threadFunc + ",args=[char]).start()\n";
                }
                else if (variableType == 'number') {
                    forLoopText = "\nfor i in range(0, "+variableValue+"):\n\tthreading.Thread(target=" + threadFunc + ",args=[i]).start()\n";
                }
                else {

                }

                editor.edit((editBuilder) => {
                    if (!hasImport){
                        editBuilder.insert(topPosition, importThread + "\n");
                    }
                    editBuilder.insert(newPosition, forLoopText + "\n"); // Insert text and a newline character
                });
            }
        }
}

module.exports = {
    title: "Create Thread with Function",
    description: "Create Thread with Function",
    funcName: "createThreadFunc",
    run: (
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.TextDocument} */ document,
        /** @type {vscode.Range | vscode.Selection} */ range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run(range)
};