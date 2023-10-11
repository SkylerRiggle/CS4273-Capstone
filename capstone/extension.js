const vscode = require('vscode');

function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.convertLoopToIterator', (document, range) => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const cursorPosition = selection.active;

            // Get the line content where the cursor is
            const line = document.lineAt(cursorPosition.line).text;

            // Check if the line contains a for loop
            const forLoopRegex = /for\s+\w+\s+in\s+\w+\s*:/;
            if (forLoopRegex.test(line)) {
                // Convert for loop to iterator expression
                const iteratorText = line.replace(forLoopRegex, 'test');
                editor.edit((editBuilder) => {
                    editBuilder.replace(selection, iteratorText);
                });
            } else {
                // Check if the line contains an iterator expression
                const iteratorRegex = /\(\s*range\s*\(\s*(\w+)\s*\)\s*\)/;
                const match = line.match(iteratorRegex);
                if (match) {
                    // Convert iterator expression to for loop
                    const variableName = match[1];
                    const forLoopText = `for ${variableName} in ${line}:`;
                    editor.edit((editBuilder) => {
                        editBuilder.replace(selection, forLoopText);
                    });
                } else {
                    vscode.window.showInformationMessage('No for loop or iterator expression found on this line.');
                }
            }
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.generateForLoop', (document, range) => {
        vscode.window.showInformationMessage('For loop generated!'); // Example notification
        const editor = vscode.window.activeTextEditor;

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
    }
    ));

    // Register a code action provider
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('python', {
            provideCodeActions(document, range, context, token) {
                const codeActions = [];
                const forLoopAction = new vscode.CodeAction('Create For Loop', vscode.CodeActionKind.Refactor);
                forLoopAction.command = {
                    command: 'extension.generateForLoop',
                    title: "Generate For Loop",
                    arguments: [document, range],
                };
                codeActions.push(forLoopAction);

                const convertAction = new vscode.CodeAction('Convert Loop/Iterator', vscode.CodeActionKind.Refactor);
                convertAction.command = {
                    command: 'extension.convertLoopToIterator',
                    title: "Convert Loop to Iterator (or vice-versa)",
                    arguments: [document, range],
                };
                codeActions.push(convertAction);

                return codeActions;
            }
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
