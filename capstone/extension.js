const vscode = require('vscode');
let threadFunc = null;

function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.generateForLoop', (document, range) => {
        vscode.window.showInformationMessage('Thread generated!'); // Example notification
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
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.generateThread', (document, range) => {
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
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.generateLoopThreadingFunction', (document, range) => {
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
    }));

    
    context.subscriptions.push(vscode.commands.registerCommand('extension.generateLoopThreading', (document, range) => {
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
                let importThread = "import threading"
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
                    editBuilder.insert(topPosition, importThread);
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

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('python', {
            provideCodeActions(document, range, context, token) {
                const codeAction = new vscode.CodeAction('Create Thread', vscode.CodeActionKind.Refactor);
                codeAction.command = {
                    command: 'extension.generateThread',
                    title: "Generate Thread",
                    arguments: [document, range],
                };
                return [codeAction];
            }
        })
    );

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('python', {
            provideCodeActions(document, range, context, token) {
                const codeAction = new vscode.CodeAction('Set Threading Function', vscode.CodeActionKind.Refactor);
                codeAction.command = {
                    command: 'extension.generateLoopThreadingFunction',
                    title: "Set Threading Function",
                    arguments: [document, range],
                };
                return [codeAction];
            }
        })
    );

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('python', {
            provideCodeActions(document, range, context, token) {
                const codeAction = new vscode.CodeAction('Create Thread using Threading Function', vscode.CodeActionKind.Refactor);
                codeAction.command = {
                    command: 'extension.generateLoopThreading',
                    title: "Generate Thread using Threading Function",
                    arguments: [document, range],
                };
                
                return [codeAction];
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
