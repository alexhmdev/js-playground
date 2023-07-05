import { Editor } from '@monaco-editor/react';
import dritsTheme from '../themes/drits.json';
import { useEffect, useRef, useState } from 'react';
import Tab from './Tab';
import Split from 'react-split-grid';
import { useDebounce } from '../hooks';
import useTabsStore from '../store/tabsStore';

function Playground() {
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const {
    tabs,
    activeTab,
    addTab,
    removeTab,
    setActiveTab,
    setTabCode,
    setTabCodeResult,
    clearTabCodeResult,
    setTabName,
  } = useTabsStore((state) => ({
    ...state,
  }));
  const [code, setCode] = useState('// start typing some code... \n');

  // we use the useDebounce hook to delay the execution of the code
  const debouncedCode = useDebounce(code, 300);

  const clearCodeResult = () => {
    const activeTabId = tabs[activeTab].id;
    clearTabCodeResult(activeTabId);
    console.table(tabs[activeTab]);
  };
  const clearOutput = () => {
    if (outputRef.current) {
      outputRef.current.textContent = '';
    }
  };

  const setCodeResult = (result) => {
    if (outputRef.current) {
      outputRef.current.innerHTML += result;
    }
    let activeTabId = tabs[activeTab].id;
    setTabCodeResult(activeTabId, result);
  };

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // set focus at the beginning of the second line
    editorRef.current.focus();
    editorRef.current.setPosition({ lineNumber: 2, column: 1 });
    // set theme
    monaco.editor.defineTheme('drits', dritsTheme);
    monaco.editor.setTheme('drits');
  }

  function setCodeFromEditor() {
    const value = editorRef.current.getValue();
    const firstLine = editorRef.current.getModel().getLineContent(1);
    const activeTabId = tabs[activeTab].id;
    // set the tab name to the first line of code only if it's not already set
    setTabName(activeTabId, firstLine);
    setTabCode(activeTabId, value);
    setCode(value);
  }

  function executeCode() {
    try {
      const result = eval(code);
      if (result) {
        console.log(result);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.table(tabs[activeTab]);
    if (outputRef.current) {
      outputRef.current.textContent = '';
      outputRef.current.innerHTML += tabs[activeTab].codeResult;
    }
    if (editorRef.current) editorRef.current.focus();
  }, [activeTab]);

  useEffect(() => {
    if (debouncedCode && editorRef.current) {
      clearCodeResult();
      clearOutput();
      executeCode();
      console.table(tabs[activeTab]);
    }
  }, [debouncedCode]);

  useEffect(() => {
    console.table(tabs[activeTab]);
  }, [tabs]);
  const addNewTab = () => {
    addTab();
    clearOutput();
  };

  const closeTab = (id) => {
    if (tabs.length === 1) {
      return;
    }
    removeTab(id);
  };

  // function to map argsuments from a console.log to a string
  const mappedArgs = (args) => {
    return args.map((arg) => {
      // avoid construtor error
      if (arg.constructor !== Object) {
        return arg;
      }
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2);
      }
      return arg;
    });
  };

  useEffect(() => {
    // mutate console.log to print to the screen
    const oldLog = console.log;

    console.log = function (...args) {
      setCodeResult(
        `<pre class="text-green-500">${mappedArgs(args).join(' ')}</pre>`
      );
    };
    // mutate console.error to print to the screen
    const oldError = console.error;

    console.error = function (...args) {
      setCodeResult(
        `<pre class="text-red-500">${mappedArgs(args).join(' ')}</pre>`
      );
      oldError(...args);
    };
    // mutate console.warn to print to the screen
    const oldWarn = console.warn;
    console.warn = function (...args) {
      setCodeResult(
        `<pre class="text-yellow-500">${mappedArgs(args).join(' ')}</pre>`
      );
      oldWarn(...args);
    };

    // mutate console.info to print to the screen
    const oldInfo = console.info;
    console.info = function (...args) {
      setCodeResult(
        `<pre class="text-blue-500">${mappedArgs(args).join(' ')}</pre>`
      );
      oldInfo(...args);
    };

    return () => {
      console.log = oldLog;
      console.error = oldError;
      console.warn = oldWarn;
      console.info = oldInfo;
    };
  }, [activeTab]);

  return (
    <div className="flex-col h-screen items-center justify-center">
      <header className="flex gap-2 justify-center items-center">
        <img src="/logoRED.svg" alt="logo" className="w-9" />
        <h1 className="text-3xl text-transparent font-extrabold bg-clip-text bg-gradient-to-r from-red-400 to-purple-500">
          DritsJS - Playground
        </h1>
        <a
          href="https://github.com/alexhmdev/js-playground"
          target="_blank"
          rel="noreferrer"
          className="absolute right-2 top-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-brand-github"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
          </svg>
        </a>
      </header>
      <nav className="flex border-b-[1px] border-slate-500 overflow-auto">
        {tabs.map((tab, index) => (
          <Tab
            key={tab.id}
            tabIndex={index}
            id={tab.id}
            name={tab.name}
            active={tab.active}
            onClose={closeTab}
            setActiveTab={setActiveTab}
            changeName={setTabName}
          />
        ))}
        <button onClick={addNewTab} className="ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </nav>
      <Split
        minSize={100}
        cursor="col-resize"
        render={({ getGridProps, getGutterProps }) => (
          <div
            className="w-full h-full grid grid-cols-[1fr,12px,1fr]"
            {...getGridProps()}
          >
            <div className="overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                defaultValue={tabs[activeTab].code}
                theme="drits"
                width="100%"
                path={tabs[activeTab].id}
                onMount={handleEditorDidMount}
                onChange={setCodeFromEditor}
                options={{
                  fontSize: 16,
                  fontLigatures: true,
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  roundedSelection: false,
                  autoDetectHighContrast: false,
                  minimap: {
                    enabled: false,
                  },
                }}
              />
            </div>
            <div
              className="bg-black flex hover:cursor-col-resize flex-col justify-center items-center after:content-[''] after:h-[64px] after:bg-slate-200 after:w-[2px] after:rounded-lg"
              {...getGutterProps('column', 1)}
            />
            <div className="px-4 overflow-auto">
              <pre ref={outputRef}></pre>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default Playground;
