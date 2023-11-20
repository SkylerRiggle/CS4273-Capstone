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

        // Extract the variable name for the collection
        const collectionVariableRegex = /\b(\w+)\s*=/;
        const collectionMatch = line.match(collectionVariableRegex);

        if (collectionMatch) {
            const collectionVariableName = collectionMatch[1];

            // Determine the type of collection (e.g., list, dictionary)
            // You can use your own logic to determine the collection type

            const collectionType = 'list'; // Placeholder; implement your type detection logic here

            // Prompt the user for the batch size
            const batchSizeInput = await vscode.window.showInputBox({
                prompt: 'Enter the batch size:',
                placeHolder: 'e.g., 10',
                validateInput: (value) => {
                    if (!/^\d+$/.test(value) || parseInt(value) <= 0) {
                        return 'Please enter a valid positive integer batch size.';
                    }
                    return null;
                },
            });

            if (batchSizeInput === undefined) {
                // User canceled the input
                return;
            }

            const batchSize = parseInt(batchSizeInput);

            // Create the batch iterator code based on the collection type and batch size
            let batchIteratorText = '\n'; // Start with a newline character

            if (collectionType === 'list') {
                // Generate code for iterating through a list in batches
                batchIteratorText += `for i in range(0, len(${collectionVariableName}), ${batchSize}):\n`;
                batchIteratorText += `    batch = ${collectionVariableName}[i:i + ${batchSize}]\n`;
                batchIteratorText += `    # Insert code here to process each batch\n`;
            } else if (collectionType === 'dictionary') {
                // Generate code for iterating through a dictionary in batches
                batchIteratorText += `\nkeys = list(${collectionVariableName}.keys())\n`;
                batchIteratorText += `for i in range(0, len(keys), ${batchSize}):\n`;
                batchIteratorText += `    batch_keys = keys[i:i + ${batchSize}]\n`;
                batchIteratorText += `    batch = {k: ${collectionVariableName}[k] for k in batch_keys}\n`;
                batchIteratorText += `    # Insert code here to process each batch\n`;
            }

            // Insert the batch iterator code into the editor
            editor.edit((editBuilder) => {
                editBuilder.insert(newPosition, batchIteratorText); // Insert text and a newline character
            });
        } else {
            vscode.window.showErrorMessage('No collection variable found at the cursor position.');
        }
    }
}

module.exports = {
    title: "Generate Batch Iterator",
    description: "Generate Batch Iterator",
    funcName: "generateBatchIterator",
    run: (
        /** @type {vscode.TextDocument} */ document,
        /** @type {vscode.Range | vscode.Selection} */ range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run(document, range)
};