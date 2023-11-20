const vscode = require('vscode');


function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.convertLoopToIterator', (document, range) => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const cursorPosition = selection.active;

            // Get the lines where the loop is located
            const loopStartLine = document.lineAt(range.start.line).text;
            const loopEndLine = document.lineAt(range.end.line).text;

            // Use a regular expression to extract loop variable and iterable
            const loopRegex = /\bfor\s+(\w+)\s+in\s+(\w+):/;
            const matchStart = loopStartLine.match(loopRegex);
            const matchEnd = loopEndLine.match(/^\s+(.*)/);

            if (matchStart && matchEnd) {
                const loopVariable = matchStart[1];
                const iterable = matchStart[2];
                const operation = matchEnd[1].trim(); // Extract operation inside the loop

                // Use a regular expression to extract the variable used for appending
                const appendRegex = /\b(\w+)\.append/;
                const appendMatch = operation.match(appendRegex);
                const resultVariable = appendMatch ? appendMatch[1] : 'result';

                // Generate the list comprehension expression with assignment to the variable
                const listComprehension = `${resultVariable} = [${operation.replace(`${resultVariable}.append`, '')} for ${loopVariable} in ${iterable}]`;

                editor.edit((editBuilder) => {
                    // Replace the loop and its content with the list comprehension
                    editBuilder.replace(range, listComprehension);
                });
            }
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.convertIteratorToLoop', (document, range) => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const cursorPosition = selection.active;

            // Get the line content where the cursor is
            const line = document.lineAt(cursorPosition.line).text;

            // Use a regular expression to extract information from the list comprehension
            const listComprehensionRegex = /^(\w+)\s*=\s*\[([\s\S]*)\s+for\s+(\w+)\s+in\s+(\w+)\]$/;
            const match = line.match(listComprehensionRegex);

            if (match) {
                const resultVariable = match[1];
                const operation = match[2].trim();
                const loopVariable = match[3];
                const iterable = match[4];

                // Generate the for loop expression
                const forLoopExpression = `for ${loopVariable} in ${iterable}:\n\t${resultVariable}.append(${operation})`;

                editor.edit((editBuilder) => {
                    // Replace the list comprehension with the for loop
                    editBuilder.replace(range, forLoopExpression);
                });
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

                const convertToIteratorAction = new vscode.CodeAction('Convert Loop to Iterator', vscode.CodeActionKind.Refactor);
                convertToIteratorAction.command = {
                    command: 'extension.convertLoopToIterator',
                    title: "Convert Loop to Iterator",
                    arguments: [document, range],
                };
                codeActions.push(convertToIteratorAction);

                const convertToLoopAction = new vscode.CodeAction('Convert Iterator to Loop', vscode.CodeActionKind.Refactor);
                convertToLoopAction.command = {
                    command: 'extension.convertIteratorToLoop',
                    title: "Convert Iterator to Loop",
                    arguments: [document, range],
                };
                codeActions.push(convertToLoopAction);

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
