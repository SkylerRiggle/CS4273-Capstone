const vscode = require('vscode');

const run = async () =>
{

}

module.exports = {
    title: "Generate Code With Bard API",
    description: "Generate Code With Bard",
    funcName: "generateBardCode",
    run: (
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.TextDocument} */ _document,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.Range | vscode.Selection} */ _range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run()
};