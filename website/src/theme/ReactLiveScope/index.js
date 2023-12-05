import React from 'react';

const listenOn = (elem, eventName, callback) => {
  const eventCallback = (e) => {
    console.log(`Event: ${eventName}`, e);
    const printObj = (callback && callback(e)) || e.context.data;
    print(printObj);
  };

  setTimeout(() => {
    if (elem) {
      elem.addEventListener(eventName, eventCallback);
    }
  }, 500);

  return () => {
    elem.removeEventListener(eventName, eventCallback);
  };
}

const createRefWithListener = (eventName, callback) => {
  const myRef = React.useRef(null);
  React.useEffect(() => {
    const elem = myRef.current;
    return listenOn(elem, eventName, callback);
  });
  return myRef;
}

const print = (printObject) => {
  const elem = document.querySelector('#output');
  if (elem) {
    document.querySelector('#output-box').style.display = 'block';
    elem.innerHTML = JSON.stringify(printObject, null, 2);
  }
}

const getExample = (opts, d, fn) => {
  const ChartContext = React.createContext({
    key: new Date().getTime(),
    data: null,
    options: null,
  });
  const [key, setKey] = React.useState(new Date().getTime());
  const [options, setOptions] = React.useState(opts);
  const [data, setData] = React.useState(d);
  const params = {
    key,
    setKey,
    options,
    setOptions: (opts, disableMerging) => {
      setKey(new Date().getTime());
      const result = disableMerging ? opts : { ...options, ...opts };
      setOptions(() => result);
      console.log('Options:', result);
    },
    data,
    setData: (data) => {
      setKey(new Date().getTime());
      setData(() => data);
      console.log('Data:', data);
    },
  }
  return <ChartContext.Provider value={{ key, data, options }}>
    {fn(params)}
  </ChartContext.Provider>
};

const buttonsRelatedToColor = (setOptions) => (
  <>
    <Button onClick={() => setOptions({ colorMode: 'repeat', colors: ['#ff0000', '#00ff00', '#0000ff'], colorMapping: {} })}>
      Repeat Color
    </Button>
    <Button onClick={() => setOptions({ colorMode: 'lighten', colors: ['#0000ff'], colorMapping: {} })}>Lighten Color</Button>
    <Button onClick={() => setOptions({ colorMode: 'darken', colors: ['#0000ff'], colorMapping: {} })}>Darken Color</Button>
    <Button onClick={() => setOptions({ colorMode: 'random', colors: null, colorMapping: {} })}>Random Color</Button>
  </>
)

const Button = (props) => (
  <button
    {...props}
    style={{
      color: 'var(--ifm-font-color-base)',
      backgroundColor: 'var(--ifm-color-emphasis-200)',
      border: 'none',
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
      borderRadius: 4,
      padding: '0.6rem 1rem',
      cursor: 'pointer',
      ...props.style,
    }}
  />
);

const WithActions = (props) => {
  return (<div>
    {props.children}
    <footer style={{
      paddingTop: 12,
      marginTop: '1rem',
      display: 'flex',
      gap: '1rem',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
    }}>

      {props.buttons}
    </footer>
    <div id="output-box" style={{
      display: 'none',
    }}>
      <hr style={{
        marginBottom: 0,
      }} />
      <span style={{
        position: 'relative',
        top: '-1rem',
        padding: '2px 5px',
        marginLeft: 10,
        borderRadius: '4px',
        backgroundColor: 'var(--ifm-color-emphasis-200)',
        fontSize: 12,
      }}>Output</span>
      <pre style={{
        position: 'relative',
        top: -5,
        fontSize: 12,
        fontFamily: 'monospace',
        padding: 8,
        marginBottom: 0,
      }} id="output"></pre>
    </div>
  </div>);
};

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  Button,
  WithActions,
  listenOn,
  getExample,
  createRefWithListener,
  buttonsRelatedToColor,
};
export default ReactLiveScope;
