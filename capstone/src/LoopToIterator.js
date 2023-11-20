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
}

module.exports = {
    title: "Convert Loop to Iterator",
    description: "Converts a loop to an iterator expression",
    funcName: "convertLoopToIterator",
    run: (
        /** @type {vscode.TextDocument} */ document,
        /** @type {vscode.Range | vscode.Selection} */ range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run(document, range)
};