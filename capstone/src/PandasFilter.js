const
vscode = require('vscode');
// function
// activate(context)
// {

// Keon is working here

// context.subscriptions.push(vscode.commands.registerCommand('extension.filterPandas', async(document, range) => {

//     vscode.window.showInformationMessage('Filtered Pandas DataFrame!');

//     const editor = vscode.window.activeTextEditor;
//     if (editor) {

//     const document = editor.document;

//     const selection = editor.selection;

// const cursorPosition = selection.active;
// // Find location of cursor in file 
// const line = document.lineAt(cursorPosition.line).text;
// // Find the line below the range 's end position
// const lineLength = range.end.line + 1;


// const newPosition = new vscode.Position(lineLength, 0);


// const variableRegex = / \b(\w +)\s *=\s * ([ ^  # ]+)/;

// const match = line.match(variableRegex);

// if (match) {

//     const variableName = match[1];

//     const variableValue = match[2].trim();

// let filterText;

// const
// filter = await vscode.window.showInputBox({

//     placeHolder: "Data filter",

//     prompt: "Enter a filter for your Pandas DataFrame",

//     value: String(selection)

// });

// if (filter === '')
// {

//     console.log(filter);

// vscode.window.showErrorMessage('A search query is mandatory to execute this action');

// }




// if (filter !== undefined){

// const filterBy = await vscode.window.showInputBox({

// placeHolder: "Filter values",

// prompt: "What values would you like to retrieve?",

// // value: String(selection)

// });

// if (filterBy === ''){

// console.log(filterBy);

// vscode.window.showErrorMessage('A search query is mandatory to execute this action');

// }

// filterText = `\n${variableName}_${filter} = ${variableName}["${filter}" == ${filterBy}]`;




// editor.edit((editBuilder) => {

// editBuilder.insert(newPosition, filterText); // Insert text and a newline character

// // const newSelection = new vscode.Selection(, );

// // editor.selection = newSelection;

// });

// }

// }

// }

// }
// ));







// context.subscriptions.push(vscode.commands.registerCommand('extension.generateForLoop', (document, range) => {

// vscode.window.showInformationMessage('For loop generated!'); // Example notification

// const editor = vscode.window.activeTextEditor;

// if (editor) {

// const document = editor.document;
// const selection = editor.selection;
// const cursorPosition = selection.active;

// // Get the line content where the cursor is
// const line = document.lineAt(cursorPosition.line).text;
// const lineLength = range.end.line + 1; // Calculate the line below the range's end position
// const newPosition = new vscode.Position(lineLength, 0); // Create a new position at the beginning of the line
// // Use a regular expression to extract variable name, type, and value

// const variableRegex = / \b(\w+)\s *= \s * ([^  # ]+)/;
// // Modify this regex as per your code's conventions
// const match = line.match(variableRegex);

// if (match) {
// const variableName = match[1];
// const variableValue = match[2].trim(); // Remove leading and trailing whitespaces
// // Determine the variable type based on the value

// let variableType;

// if ( / ^ \d+(\.\d+)?$ /.test(variableValue)) {

// variableType = 'number';

// } else if (variableValue.startsWith('[') && variableValue.endsWith(']')) {

// variableType = 'list';

// } else if (variableValue.startsWith("'") || variableValue.startsWith('"')) {

// variableType = 'string';

// } else {

// variableType = 'unknown';

// }
// // For testing

// console.log(`Variable Name: $
//     {variableName}
// `);
// console.log(`Variable
// Value: ${variableValue}
// `);
// console.log(`Variable
// Type: ${variableType}
// `);

// let forLoopText;

// if (variableType == 'list') {
// forLoopText = `\nfor ${variableName}_item in ${variableName}:\
//     n\t  # Insert code here\n`;
// }

// else if (variableType == 'string') {
// forLoopText = `\nfor char in ${variableName}:\
//     n\t  # Insert code here\n`;
// }

// else if (variableType == 'number') {
// forLoopText = `\nfor i in range(0, ${variableValue}):\
//     n\t  # Insert code here\n`;
// }

// else {

// }
// editor.edit((editBuilder) => {
//     editBuilder.insert(newPosition, forLoopText); 
// });

// }

// }

// }));


// context.subscriptions.push(

//     vscode.languages.registerCodeActionsProvider('python', {

//         provideCodeActions(document, range, context, token)
// {

//     const
// codeAction = new
// vscode.CodeAction('Create for Loop', vscode.CodeActionKind.Refactor);

// codeAction.command = {
//     command: 'extension.generateForLoop',
//     title: "Generate For Loop",
//     arguments: [document, range],
// };

// const
// codeAction2 = new
// vscode.CodeAction('Filter data', vscode.CodeActionKind.Refactor);
// codeAction2.command = {
//     command: 'extension.filterPandas',
//     title: "Filter data",
//     arguments: [document, range],
// };

// return [codeAction2];

// }
// })
// );

// }

const run = async (document, range) => {

    vscode.window.showInformationMessage('Filtered Pandas DataFrame!');

    const editor = vscode.window.activeTextEditor;
    if (editor) {

    const document = editor.document;

    const selection = editor.selection;

const cursorPosition = selection.active;
// Find location of cursor in file 
const line = document.lineAt(cursorPosition.line).text;
// Find the line below the range 's end position
const lineLength = range.end.line + 1;


const newPosition = new vscode.Position(lineLength, 0);


const variableRegex = / \b(\w +)\s *=\s * ([ ^  # ]+)/;

const match = line.match(variableRegex);

if (match) {

    const variableName = match[1];

    const variableValue = match[2].trim();

let filterText;

const
filter = await vscode.window.showInputBox({

    placeHolder: "Data filter",

    prompt: "Enter a filter for your Pandas DataFrame",

    value: String(selection)

});

if (filter === '')
{

    console.log(filter);

vscode.window.showErrorMessage('A search query is mandatory to execute this action');

}




if (filter !== undefined){

const filterBy = await vscode.window.showInputBox({

placeHolder: "Filter values",

prompt: "What values would you like to retrieve?",

// value: String(selection)

});

if (filterBy === ''){

console.log(filterBy);

vscode.window.showErrorMessage('A search query is mandatory to execute this action');

}

filterText = `\n${variableName}_${filter} = ${variableName}["${filter}" == ${filterBy}]`;




editor.edit((editBuilder) => {

editBuilder.insert(newPosition, filterText); // Insert text and a newline character

// const newSelection = new vscode.Selection(, );

// editor.selection = newSelection;

});

}

}

}

}

module.exports = {
    title: "Create PandasDataframe Filter",
    description: "Used to filter a dataframe",
    funcName: "pandasFilter",
    run: (
        /** @type {vscode.TextDocument} */ document,
        /** @type {vscode.Range | vscode.Selection} */ range,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CodeActionContext} */ _context,
        // eslint-disable-next-line no-unused-vars
        /** @type {vscode.CancellationToken} */ _token) => run(document, range)
};