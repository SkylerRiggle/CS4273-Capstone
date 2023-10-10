const vscode = require('vscode');
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
// Access the API key
const apiKey = '';

const MODEL_NAME = "models/chat-bison-001";
const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(apiKey),
});
const editor = vscode.window.activeTextEditor;

function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.generateForLoop', (document, range) => {
        vscode.window.showInformationMessage('For loop generated!'); // Example notification

        if (editor) {
            const document = editor.document;
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
        
    }));

    // Register a code action provider
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('python', {
            provideCodeActions(document, range, context, token) {
                const codeAction = new vscode.CodeAction('Create for Loop', vscode.CodeActionKind.Refactor);
                codeAction.command = {
                    command: 'extension.generateForLoop',
                    title: "Generate For Loop",
                    arguments: [document, range],
                };
                return [codeAction];
            }
        })
    );
    context.subscriptions.push(vscode.commands.registerCommand('extension.generateBatchIterator', async (document, range) => {
        if (editor) {
            const document = editor.document;
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
    }));

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('python', {
            provideCodeActions(document, range, context, token) {
                const codeAction = new vscode.CodeAction('Generate Batch Iterator', vscode.CodeActionKind.Refactor);
                codeAction.command = {
                    command: 'extension.generateBatchIterator',
                    title: 'Generate Batch Iterator',
                    arguments: [document, range],
                };
                return [codeAction];
            },
        })
    );
}

function deactivate() {
    console.log('Python Comment Extension is deactivated');
}

module.exports = {
    activate,
    deactivate
};
