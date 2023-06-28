import { Editor } from '@monaco-editor/react';
import dritsTheme from '../themes/drits.json';
import { useEffect, useRef, useState } from 'react';
import Tab from './Tab';
import { v4 as uuidv4 } from 'uuid';
import Split from 'react-split-grid';

function Playground() {
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const [tabs, setTabs] = useState([
    {
      id: uuidv4(),
      name: 'index.js',
      code: '// start typing some code... \n',
      codeResult: '',
      active: true,
    },
  ]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const clearCodeResult = () => {
    setTabs((prevTabs) => {
      const newTabs = prevTabs.map((tab, i) => {
        if (i === currentTabIndex) {
          return { ...tab, codeResult: '' };
        } else {
          return tab;
        }
      });
      return newTabs;
    });
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
    let currentTab = currentTabIndex;
    setTabs((prevTabs) => {
      const newTabs = prevTabs.map((tab, i) => {
        if (i === currentTab) {
          return { ...tab, codeResult: (tab.codeResult += result) };
        } else {
          return tab;
        }
      });
      return newTabs;
    });
  };

  const setActiveTab = (index) => {
    const newTabs = tabs.map((tab, i) => {
      if (i === index) {
        return { ...tab, active: true };
      } else {
        return { ...tab, active: false };
      }
    });
    setTabs(() => {
      outputRef.current.textContent = '';
      outputRef.current.innerHTML += newTabs[index].codeResult;
      return newTabs;
    });
    setCurrentTabIndex(index);
    editorRef.current.focus();
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

  function executeCode() {
    clearOutput();
    clearCodeResult();
    const value = editorRef.current.getValue();
    const firstLine = editorRef.current.getModel().getLineContent(1);
    // change tab name to the first line of code
    setTabs((prevTabs) => {
      const newTabs = prevTabs.map((tab, i) => {
        if (i === currentTabIndex) {
          return {
            ...tab,
            name:
              firstLine === '' ? `Untitled-${currentTabIndex + 1}` : firstLine,
          };
        } else {
          return tab;
        }
      });
      return newTabs;
    });

    try {
      const result = eval(value);
      if (result) console.log(result);
    } catch (error) {
      console.error(error);
    }
    setTabs((prevTabs) => {
      const newTabs = prevTabs.map((tab, i) => {
        if (i === currentTabIndex) {
          return { ...tab, code: value };
        } else {
          return tab;
        }
      });
      return newTabs;
    });
  }

  const addTab = () => {
    setTabs((prevTabs) => {
      const newTabs = prevTabs.map((tab) => ({ ...tab, active: false }));
      return [
        ...newTabs,
        {
          id: uuidv4(),
          name: `Untitled-${newTabs.length + 1}`,
          code: '// start typing some code... \n',
          codeResult: '',
          active: true,
        },
      ];
    });
    setCurrentTabIndex((prevIndex) => prevIndex + 1);
    clearOutput();
    editorRef.current.focus();
    editorRef.current.setPosition({ lineNumber: 2, column: 1 });
  };

  const closeTab = (index) => {
    setTabs((prevTabs) => {
      const newTabs = prevTabs
        .filter((tab, i) => i !== index)
        .map((tab) => ({ ...tab, active: false }));
      newTabs[0].active = true;
      return newTabs;
    });
    setCurrentTabIndex(0);
  };

  useEffect(() => {
    // mutate console.log to print to the screen
    const oldLog = console.log;

    console.log = function (...args) {
      const mappedArgs = args.map((arg) => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        } else {
          return arg;
        }
      });
      setCodeResult(
        `<pre class="text-green-500">${mappedArgs.join(' ')}</pre>`
      );
      oldLog(...args, 'logging in ', currentTabIndex);
    };
    // mutate console.error to print to the screen
    const oldError = console.error;

    console.error = function (...args) {
      const mappedArgs = args.map((arg) => {
        // avoid construtor error
        oldLog(arg.constructor);
        if (arg.constructor !== Object) {
          return arg;
        }
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        }
        return arg;
      });
      setCodeResult(`<pre class="text-red-500">${mappedArgs.join(' ')}</pre>`);
      oldError(...args);
    };
    // mutate console.warn to print to the screen
    const oldWarn = console.warn;
    console.warn = function (...args) {
      const mappedArgs = args.map((arg) => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        } else {
          return arg;
        }
      });
      setCodeResult(
        `<pre class="text-yellow-500">${mappedArgs.join(' ')}</pre>`
      );
      oldWarn(...args);
    };

    // mutate console.info to print to the screen
    const oldInfo = console.info;
    console.info = function (...args) {
      const mappedArgs = args.map((arg) => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        } else {
          return arg;
        }
      });
      setCodeResult(`<pre class="text-blue-500">${mappedArgs.join(' ')}</pre>`);
      oldInfo(...args);
    };

    return () => {
      console.log = oldLog;
      console.error = oldError;
      console.warn = oldWarn;
      console.info = oldInfo;
    };
  }, [currentTabIndex]);

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
      <nav className="flex border-b-[1px] border-slate-500">
        {tabs.map((tab, index) => (
          <Tab
            key={tab.id}
            tabIndex={index}
            name={tab.name}
            active={tab.active}
            close={closeTab}
            setActiveTab={setActiveTab}
          />
        ))}
        <button onClick={addTab} className="ml-2">
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
                defaultValue={tabs[currentTabIndex].code}
                theme="drits"
                width="100%"
                path={tabs[currentTabIndex].id}
                onMount={handleEditorDidMount}
                onChange={executeCode}
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
