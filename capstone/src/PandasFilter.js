const vscode = require('vscode');

async function run(document, range) {
    vscode.window.showInformationMessage('Filtered Pandas DataFrame!');

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found');
        return;
    }

    const selection = editor.selection;
    const cursorPosition = selection.active;
    const line = document.lineAt(cursorPosition.line).text;
    const lineLength = range.end.line + 1;
    const newPosition = new vscode.Position(lineLength, 0);

    // Regex to find DataFrame variable assignments
    const variableRegex = /\b(\w+)\s*=\s*pd\.DataFrame\(\w*\)/;
    const match = line.match(variableRegex);

    if (match) {
        const variableName = match[1];

        // Ask user for filter column
        const filterColumn = await vscode.window.showInputBox({
            placeHolder: "Column name to filter",
            prompt: "Enter the column name for filtering the DataFrame",
        });

        if (!filterColumn) {
            vscode.window.showErrorMessage('Column name is required to filter DataFrame');
            return;
        }

        // Ask if the column is a string or an integer
        const isColumnString = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: 'Is the column a string?'
        });

        const columnFormat = isColumnString === 'Yes' ? `"${filterColumn}"` : filterColumn;

        // Ask user for filter value
        const filterValue = await vscode.window.showInputBox({
            placeHolder: "Filter value",
            prompt: `Enter the value to filter the column ${filterColumn}`,
        });

        if (filterValue === undefined) {
            vscode.window.showErrorMessage('Filter value is required');
            return;
        }

        // Ask if the filter value is a string or an integer
        const isValueString = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: 'Is the filter value a string?'
        });

        const valueFormat = isValueString === 'Yes' ? `"${filterValue}"` : filterValue;

        const filterText = `\n${variableName}_filtered = ${variableName}[${variableName}[${columnFormat}] == ${valueFormat}]\n`;

        editor.edit(editBuilder => {
            editBuilder.insert(newPosition, filterText);
        });
    } else {
        vscode.window.showErrorMessage('No DataFrame assignment found in the current line');
    }
}

module.exports = {
    title: "Create PandasDataframe Filter",
    description: "Create PandasDataframe Filter",
    funcName: "pandasFilter",
    run: (
        /** @type {vscode.TextDocument} */ document,
        /** @type {vscode.Range | vscode.Selection} */ range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run(document, range)
};