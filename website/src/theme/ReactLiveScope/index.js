import React from 'react';
import { merge } from 'lodash';

const listenOn = (elem, eventName, callback) => {
  const eventCallback = (e) => {
    const printObj = callback && callback(e);
    if (printObj) {
      print(printObj);
    }
  };

  setTimeout(() => {
    if (elem) {
      elem.removeEventListener(eventName, eventCallback);
      elem.addEventListener(eventName, eventCallback);
    }
  }, 100);

  return () => {
    elem.removeEventListener(eventName, eventCallback);
  };
};

const createRefWithListener = (eventName, callback) => {
  const myRef = React.useRef(null);
  React.useEffect(() => {
    const elem = myRef.current;
    return listenOn(elem, eventName, callback);
  });
  return myRef;
};

const print = (printObject) => {
  const elem = document.querySelector('#output');
  if (elem) {
    document.querySelector('#output-box').style.display = 'block';
    elem.innerHTML = JSON.stringify(printObject, null, 2);
  }
};

const getExample = (opts, d, fn) => {
  const ChartContext = React.createContext({
    key: new Date().getTime(),
    data: null,
    options: null,
  });
  const [key, setKey] = React.useState(new Date().getTime());
  console.log('setKey', setKey);
  const [options, setOptions] = React.useState(opts);
  const initialOptions = opts;
  const [others, setOthers] = React.useState({});
  const [data, setData] = React.useState(d);
  const params = {
    key,
    setKey,
    options,
    setOptions: (opts, inherit) => {
      setKey(new Date().getTime());
      const result = inherit ? merge({}, options, opts) : merge({}, initialOptions, opts);
      setOptions(() => result);
      console.log('setOptions:', result);
    },
    toggleOptions: (name, opts1, opts2) => {
      setKey(new Date().getTime());
      const othersValue = merge({}, others, {
        [name]: !others[name],
      });
      setOthers(othersValue);
      const result = merge({}, options, !others[name] ? opts1 : opts2);
      setOptions(() => result);
      console.log('toggleOptions:', result);
    },
    data,
    setData: (data) => {
      setKey(new Date().getTime());
      setData(() => data);
      console.log('Data:', data);
    },
    others,
    setOthers,
  };
  return <ChartContext.Provider value={{ key, data, options }}>{fn(params)}</ChartContext.Provider>;
};

const buttonsRelatedToColor = (setOptions) => (
  <>
    <Button
      onClick={() => setOptions({ colorMode: 'repeat', colors: ['#ff0000', '#00ff00', '#0000ff'], colorMapping: {} })}
    >
      Repeat Color
    </Button>
    <Button onClick={() => setOptions({ colorMode: 'lighten', colors: ['#0000ff'], colorMapping: {} })}>
      Lighten Color
    </Button>
    <Button onClick={() => setOptions({ colorMode: 'darken', colors: ['#0000ff'], colorMapping: {} })}>
      Darken Color
    </Button>
    <Button onClick={() => setOptions({ colorMode: 'random', colors: null, colorMapping: {} })}>Random Color</Button>
  </>
);

const classNamesForButton =
  'hover:outline-gray-400/40 hover:outline-2 outline cursor-pointer py-2 px-4 border-none border-transparent rounded';

const Button = (props) => (
  <button
    {...props}
    className={classNamesForButton}
    style={{
      color: 'var(--ifm-color-content-inverse)',
      backgroundColor: 'var(--ifm-color-emphasis-600)',
      ...props.style,
    }}
  />
);

const ToggleButton = (props) => {
  function onClick(evt) {
    if (props.onChange) {
      props.onChange();
      evt.preventDefault();
    }
  }

  return (
    <label
      className="outline outline-0 outline-offset-2 rounded-full hover:outline-2 relative inline-flex items-center mb-5 cursor-pointer"
      style={{
        outlineColor: 'transparent',
      }}
      onClick={onClick.bind(this)}
    >
      <input type="checkbox" value="" className="sr-only peer" checked={props.checked} onChange={() => {}} />
      <div
        className="w-9 h-5 outline outline-transparent outline-offset-1 hover:outline-2 hover:outline-gray-400/50 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"
        style={{
          backgroundColor: props.checked ? 'var(--ifm-color-emphasis-600)' : 'var(--ifm-color-emphasis-200)',
        }}
      ></div>
      <span
        className="ml-2 mr-2 text-sm font-medium"
        style={{
          color: 'var(--ifm-font-color-base)',
        }}
      >
        {props.children}
      </span>
    </label>
  );
};

const WithActions = (props) => {
  return (
    <div>
      {props.children}
      <footer
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {props.buttons}
      </footer>
      <div
        id="output-box"
        style={{
          display: 'none',
        }}
      >
        <hr
          style={{
            marginBottom: 0,
          }}
        />
        <span
          style={{
            position: 'relative',
            top: '-1rem',
            padding: '2px 5px',
            marginLeft: 10,
            borderRadius: '4px',
            backgroundColor: 'var(--ifm-color-emphasis-200)',
            fontSize: 12,
          }}
        >
          Output
        </span>
        <pre
          style={{
            position: 'relative',
            top: -5,
            fontSize: 12,
            fontFamily: 'monospace',
            padding: 8,
            marginBottom: 0,
          }}
          id="output"
        ></pre>
      </div>
    </div>
  );
};

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  Button,
  ToggleButton,
  WithActions,
  listenOn,
  getExample,
  createRefWithListener,
  buttonsRelatedToColor,
};
export default ReactLiveScope;
