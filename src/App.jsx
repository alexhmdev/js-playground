import { Editor } from '@monaco-editor/react';
import dritsTheme from './themes/drits.json';
import { useEffect, useRef } from 'react';
function App() {
  const editorRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    // mutate console.log to print to the screen
    const oldLog = console.log;

    console.log = function (...args) {
      oldLog(...args);
      if (resultRef.current) {
        resultRef.current.innerHTML += args.join(' ') + '\n';
      }
    };
    // mutate console.error to print to the screen
    const oldError = console.error;

    console.error = function (...args) {
      if (resultRef.current) {
        resultRef.current.innerHTML += `<pre class="text-red-500">${args.join(
          ' '
        )}</pre>`;
      }
      oldError(...args);
    };
    // mutate console.warn to print to the screen
    const oldWarn = console.warn;
    console.warn = function (...args) {
      if (resultRef.current) {
        resultRef.current.innerHTML += `<pre class="text-yellow-500">${args.join(
          ' '
        )}</pre>`;
      }
      oldWarn(...args);
    };
    return () => {
      console.log = oldLog;
      console.error = oldError;
      console.warn = oldWarn;
    };
  }, []);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monaco.editor.defineTheme('drits', dritsTheme);
    monaco.editor.setTheme('drits');
  }

  function showValue() {
    const value = editorRef.current.getValue();
    resultRef.current.textContent = '';
    const coderesult = eval(value);
    console.log(coderesult);
  }
  return (
    <div className="flex-col min-h-screen items-center justify-center bg-[#0b1015] text-white">
      <h1 className="text-6xl">DritsJS</h1>
      <div className="grid grid-cols-2">
        <Editor
          height="90vh"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          theme="drits"
          width="100%"
          onMount={handleEditorDidMount}
          onChange={showValue}
          options={{
            fontSize: 16,
            wordWrap: 'on',
            minimap: { enabled: false },
          }}
        />
        <pre ref={resultRef} className="text-green-400 text-base"></pre>
      </div>
    </div>
  );
}

export default App;
