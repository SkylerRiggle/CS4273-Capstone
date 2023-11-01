const vscode = require('vscode');

const BARD_COMMENT = "# BARD:";
const PROMPT_ADDON = "Use python, import any needed packages, include code comments as needed, and use explicit types.";

/**
 * Generates some code based on the user's input prompt
 * @param {vscode.TextDocument} document 
 */
const run = async (document) =>
{
    // Get the currently active editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    // Ensure that the line in question is a bard command
    const line = document.lineAt(editor.selection.active);
    let prompt = line.text.trim();
    if (!prompt.startsWith(BARD_COMMENT)) { return; }

    // Sanitize the prompt and add the "under the hood" comments
    prompt = `${prompt.replace(BARD_COMMENT, "")}.\n${PROMPT_ADDON}`;

    // Send the prompt to the Bard API for generation
    // TODO
    let code = "```python\nfor i in range(0, 10):\n\tprint(i)\n```";

    // Sanitize the generated code
    code = code.replace("```python", "").replace("```", "").trim();

    // Insert the code into the file in place of the comment
    editor.edit((editBuilder) => {
        editBuilder.replace(line.range, code);
    });
}

module.exports = {
    title: "Generate Code With Bard API",
    description: "Generate Code With Bard",
    funcName: "generateBardCode",
    run: (
        /** @type {vscode.TextDocument} */ document,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.Range | vscode.Selection} */ _range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run(document)
};