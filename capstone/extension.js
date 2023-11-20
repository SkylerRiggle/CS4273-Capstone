const vscode = require('vscode');

/* Handler Imports */
const commandData = [
    require("./src/ForLoop"),
    require("./src/BardComments"),
    require("./src/Threading"),
    require("./src/SetThreadingFunction"),
    require("./src/ThreadWithFunction"),
    require("./src/BatchIterator"),
    require("./src/LoopToIterator"),
    require("./src/IteratorToLoop")
];

function activate(context) {
    // Register commands
    for (const handler of commandData)
    {
        context.subscriptions.push(vscode.commands.registerCommand(
            `extension.${handler.funcName}`,
            handler.run
        ));
    }

    // Register a code action provider to each command
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('python', {
            provideCodeActions(document, range, context, token) {
                const result = [];

                for (const handler of commandData)
                {
                    const codeAction = new vscode.CodeAction(handler.description, vscode.CodeActionKind.Refactor);
                    codeAction.command = {
                        command: `extension.${handler.funcName}`,
                        title: handler.title,
                        arguments: [document, range, context, token]
                    };

                    result.push(codeAction);
                }

                return result;
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
