import React from 'react';

const listenOn = (selector, eventName, callback) => {
  setTimeout(() => {
    const elem = document.querySelector(selector);
    if (elem) {
      elem.addEventListener(eventName, (e) => {
        callback(e.detail);
      });
    }
  }, 500);
}

const ButtonExample = (props) => (
  <button
    {...props}
    style={{
      backgroundColor: 'white',
      color: 'black',
      border: 'solid red',
      borderRadius: 20,
      padding: 10,
      cursor: 'pointer',
      ...props.style,
    }}
  />
);

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  ButtonExample,

  listenOn,
};
export default ReactLiveScope;
