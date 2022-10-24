import * as vscode from 'vscode';

import { getInstanceOfExtension } from '../helpers/instanceOfExtension';
import { getExtensionContext } from './../helpers/context';

import { createInstance } from '../helpers/instanceOfCommand';

const runDebugCommand = async () => {
	// Set instances
	const instanceOfExtension = getInstanceOfExtension();
	const instanceOfCommand = createInstance();

	const commandExecutionInstance = `${instanceOfCommand.getInstance()}`;
	console.log(`[${instanceOfExtension}|runDebugCommand]\nExecuted!\n<${commandExecutionInstance}>`);

	const context = getExtensionContext();

	// Output the results of the command
	await vscode.window.showInformationMessage(
		`[${instanceOfExtension}|runDebugCommand]\nExecuted!\n<${commandExecutionInstance}>`
	);
};

export const registerDebugCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(vscode.commands.registerCommand('hyper-lambda.runDebugCommand', runDebugCommand));
};

export default registerDebugCommands;
