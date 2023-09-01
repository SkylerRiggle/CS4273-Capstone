import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext)
{
	let disposable = vscode.commands.registerCommand('test.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Test!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
