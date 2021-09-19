import CodeMirror from 'codemirror';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/javascript/javascript';
import YAML from 'yaml';

const startValue = `
on:
  # Trigger the workflow on push or pull request,
  # but only for the main branch
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  # Also trigger on page_build, as well as release created events
  page_build:
  release:
    types: # This configuration does not affect the page_build event above
      - created
`.trim();

const changeHandler = (dst: CodeMirror.Editor) => {
  return (cm: CodeMirror.Editor, _changes: CodeMirror.EditorChange) => {
    const value = cm.getValue();
    try {
      const parsed = YAML.parse(value);
      const jsonString = JSON.stringify(parsed, null, 2);
      dst.setValue(jsonString);
    } catch (err) {
      dst.setValue(err.toString());
    }
  };
};

window.addEventListener('DOMContentLoaded', () => {
  const cmRoot = document.querySelector('#cm-target');
  const cmView = document.querySelector('#cm-view');
  const srcEditor = CodeMirror.fromTextArea(cmRoot as HTMLTextAreaElement, {
    mode: 'yaml',
    theme: 'dracula',
  });
  const dstEditor = CodeMirror.fromTextArea(cmView as HTMLTextAreaElement, {
    mode: 'javascript',
    readOnly: true,
  });

  const h = changeHandler(dstEditor);
  srcEditor.on('change', h);

  srcEditor.setValue(startValue);
});