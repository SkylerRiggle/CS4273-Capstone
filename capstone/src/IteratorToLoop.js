const vscode = require('vscode');

/**
 * Handles the generation of a python for loop.
 * @param {vscode.TextDocument} document 
 * @param {vscode.Selection | vscode.Range} range 
 */
const run = async (document, range) =>
{
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
}

module.exports = {
    title: "Convert Iterator to Loop",
    description: "Converts an iterator to a loop",
    funcName: "convertIteratorToLoop",
    run: (
        /** @type {vscode.TextDocument} */ document,
        /** @type {vscode.Range | vscode.Selection} */ range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run(document, range)
};