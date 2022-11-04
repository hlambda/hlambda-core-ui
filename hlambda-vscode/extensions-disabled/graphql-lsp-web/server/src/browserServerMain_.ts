import {
  createConnection,
  BrowserMessageReader,
  BrowserMessageWriter,
} from "vscode-languageserver/browser";

import {
  Color,
  ColorInformation,
  Range,
  InitializeParams,
  InitializeResult,
  ServerCapabilities,
  TextDocuments,
  ColorPresentation,
  TextEdit,
  TextDocumentIdentifier,
  CodeAction,
  DiagnosticSeverity,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

console.log("running server lsp-web-extension-sample");

/* browser specific setup code */

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

/* from here on, all code is non-browser specific and could be shared with a regular extension */

connection.onInitialize((params: InitializeParams): InitializeResult => {
  const capabilities: ServerCapabilities = {
    colorProvider: {}, // provide a color provider
  };
  return { capabilities };
});

// Track open, change and close text document events
const documents = new TextDocuments(TextDocument);
documents.listen(connection);

// Register providers
connection.onDocumentColor((params) => {
  return getColorInformation(params.textDocument);
});
connection.onColorPresentation((params) =>
  getColorPresentation(params.color, params.range)
);

// connection.onCodeAction((params) => {
//   const actionsInfo: CodeAction[] = [];

//   const document = documents.get(params.textDocument.uri);
//   if (document) {
//     const text = document.getText();

//     colorRegExp.lastIndex = 0;
//     let match;
//     while ((match = colorRegExp.exec(text)) != null) {
//       const offset = match.index;
//       const length = match[0].length;

//       const range = Range.create(
//         document.positionAt(offset),
//         document.positionAt(offset + length)
//       );
//       const color = parseColor(text, offset);
//       actionsInfo.push({ title: "WOW" + text });
//     }
//   }

//   return actionsInfo;
// });

const getBlacklisted = (text: any) => {
  console.log(text);

  const blacklist = ["ffffff", "0f0f0f", "000011"];
  const regex = new RegExp(`\\b(${blacklist.join("|")})\\b`, "gi");
  const results = [];
  let matches;
  while ((matches = regex.exec(text)) && results.length < 100) {
    results.push({
      value: matches[0],
      index: matches.index,
    });
  }
  return results;
};

const blacklistToDiagnostic =
  (textDocument: any) =>
  ({ index, value }: any) => ({
    severity: DiagnosticSeverity.Warning,
    range: {
      start: textDocument.positionAt(index),
      end: textDocument.positionAt(index + value.length),
    },
    message: `${value} is blacklisted.`,
    source: "Blacklister",
  });

const getDiagnostics = (textDocument: any) =>
  getBlacklisted(textDocument.getText()).map(
    blacklistToDiagnostic(textDocument)
  );

documents.onDidChangeContent((change) => {
  connection.sendDiagnostics({
    uri: change.document.uri,
    diagnostics: getDiagnostics(change.document),
  });
});

// Listen on the connection
connection.listen();

const colorRegExp = /#([0-9A-Fa-f]{6})/g;

function getColorInformation(textDocument: TextDocumentIdentifier) {
  const colorInfos: ColorInformation[] = [];

  const document = documents.get(textDocument.uri);
  if (document) {
    const text = document.getText();

    colorRegExp.lastIndex = 0;
    let match;
    while ((match = colorRegExp.exec(text)) != null) {
      const offset = match.index;
      const length = match[0].length;

      const range = Range.create(
        document.positionAt(offset),
        document.positionAt(offset + length)
      );
      const color = parseColor(text, offset);
      connection.sendDiagnostics({
        uri: textDocument.uri,
        diagnostics: getDiagnostics(document),
      });
      colorInfos.push({ color, range });
    }
  }

  return colorInfos;
}

function getColorPresentation(color: Color, range: Range) {
  const result: ColorPresentation[] = [];
  const red256 = Math.round(color.red * 255),
    green256 = Math.round(color.green * 255),
    blue256 = Math.round(color.blue * 255);

  function toTwoDigitHex(n: number): string {
    const r = n.toString(16);
    return r.length !== 2 ? "0" + r : r;
  }

  const label = `#${toTwoDigitHex(red256)}${toTwoDigitHex(
    green256
  )}${toTwoDigitHex(blue256)}`;
  result.push({ label: label, textEdit: TextEdit.replace(range, label) });

  return result;
}

const enum CharCode {
  Digit0 = 48,
  Digit9 = 57,

  A = 65,
  F = 70,

  a = 97,
  f = 102,
}

function parseHexDigit(charCode: CharCode): number {
  if (charCode >= CharCode.Digit0 && charCode <= CharCode.Digit9) {
    return charCode - CharCode.Digit0;
  }
  if (charCode >= CharCode.A && charCode <= CharCode.F) {
    return charCode - CharCode.A + 10;
  }
  if (charCode >= CharCode.a && charCode <= CharCode.f) {
    return charCode - CharCode.a + 10;
  }
  return 0;
}

function parseColor(content: string, offset: number): Color {
  const r =
    (16 * parseHexDigit(content.charCodeAt(offset + 1)) +
      parseHexDigit(content.charCodeAt(offset + 2))) /
    255;
  const g =
    (16 * parseHexDigit(content.charCodeAt(offset + 3)) +
      parseHexDigit(content.charCodeAt(offset + 4))) /
    255;
  const b =
    (16 * parseHexDigit(content.charCodeAt(offset + 5)) +
      parseHexDigit(content.charCodeAt(offset + 6))) /
    255;
  return Color.create(r, g, b, 1);
}
