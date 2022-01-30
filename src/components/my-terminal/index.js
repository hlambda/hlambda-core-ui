import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import './style.css';

export const LineType = {
  Input: 'Input',
  Output: 'Output',
};

export const ColorMode = {
  Light: 'Light',
  Dark: 'Dark',
};

// export interface Props {
//   name?: string
//   prompt?: string
//   colorMode?: ColorMode
//   lineData: Array<{type: LineType, value: string}>
//   onInput?: ((input: string) => void) | null | undefined,
//   startingInputValue?: string
// }

const Terminal = ({
  name,
  prompt,
  colorMode,
  lineData,
  onInput,
  startingInputValue = '',
  inputHistory,
  setInputHistory,
}) => {
  // const [inputHistory, setInputHistory] = useState(['']);
  const [positionInHistory, setPositionInHistory] = useState(0);
  const [carrotPosition, setCarrotPosition] = useState(0);
  const [currentLineInput, setCurrentLineInput] = useState('');

  const lastLineRef = useRef();

  const updateCarrotPosition = (event) => {
    setCarrotPosition(event.target.selectionStart);
  };

  const updateCurrentLineInput = (event) => {
    setCurrentLineInput(event.target.value);
    setCarrotPosition(event.target.selectionStart);
  };

  React.useEffect(() => {
    setCurrentLineInput(inputHistory[positionInHistory]);
  }, [inputHistory, positionInHistory]);

  const handleKeyDown = (event) => {
    if (event.keyCode == 38 || event.keyCode == 40) {
      event.preventDefault();
      // setCarrotPosition();
      event.keyCode == 38 &&
        setPositionInHistory(() => {
          return (
            (inputHistory.length + (positionInHistory + 1)) %
            inputHistory.length
          );
        });
      event.keyCode == 40 &&
        setPositionInHistory(() => {
          return (
            (inputHistory.length + (positionInHistory - 1)) %
            inputHistory.length
          );
        });
      console.log(inputHistory);
      return;
    }

    if (onInput != null && event.key === 'Enter') {
      onInput(currentLineInput);
      setInputHistory([...inputHistory, currentLineInput]);
      setPositionInHistory(0);
      setCurrentLineInput('');
    }
  };

  useEffect(() => {
    setCurrentLineInput(startingInputValue.trim());
  }, [startingInputValue]);

  // An effect that handles scrolling into view the last line of terminal input or output
  const performScrolldown = useRef(false);
  useEffect(() => {
    if (performScrolldown.current) {
      // skip scrolldown when the component first loads
      setTimeout(
        () =>
          lastLineRef?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          }),
        500
      );
    }
    performScrolldown.current = true;
  }, [lineData.length]);

  // We use a hidden input to capture terminal input; make sure the hidden input is focused when clicking anywhere on the terminal
  useEffect(() => {
    if (onInput == null) {
      return;
    }
    // keep reference to listeners so we can perform cleanup
    const elListeners = [];
    for (const terminalEl of document.getElementsByClassName(
      'react-terminal-wrapper'
    )) {
      const listener = () =>
        terminalEl?.querySelector('.terminal-hidden-input')?.focus();
      terminalEl?.addEventListener('click', listener);
      elListeners.push({ terminalEl, listener });
    }
    return function cleanup() {
      elListeners.forEach((elListener) => {
        elListener.terminalEl.removeEventListener('click', elListener.listener);
      });
    };
  }, [onInput]);

  const renderedLineData = lineData.map((ld, i) => {
    const classes = ['react-terminal-line'];
    if (ld.type === LineType.Input) {
      classes.push('react-terminal-input');
    }
    // `lastLineRef` is used to ensure the terminal scrolls into view to the last line; make sure to add the ref to the last
    // redendered line if input prompt is not shown, i.e. `onInput` is not declared; see 'render prompt' below
    if (lineData.length === i + 1 && onInput == null) {
      return (
        <span className={classes.join(' ')} key={i} ref={lastLineRef}>
          {ld.value}
        </span>
      );
    } else {
      return (
        <pre className={classes.join(' ')} key={i}>
          {ld.value}
        </pre>
      );
    }
  });

  // render prompt
  if (onInput != null) {
    renderedLineData.push(
      <span
        className="react-terminal-line react-terminal-input"
        data-terminal-prompt={prompt || '$'}
        key={lineData.length}
        ref={lastLineRef}
      >
        {currentLineInput.substring(0, carrotPosition)}
        <span className="react-terminal-active-input"></span>
        {currentLineInput.substring(carrotPosition)}
      </span>
    );
  }

  const classes = ['react-terminal-wrapper'];
  if (colorMode === ColorMode.Light) {
    classes.push('react-terminal-light');
  }
  return (
    <div className={classes.join(' ')} data-terminal-name={name}>
      <div className="react-terminal">{renderedLineData}</div>
      <input
        className="terminal-hidden-input"
        placeholder="Terminal Hidden Input"
        value={currentLineInput}
        autoFocus={onInput != null}
        onChange={updateCurrentLineInput}
        onKeyDown={handleKeyDown}
        onKeyUp={updateCarrotPosition}
      />
    </div>
  );
};

export default Terminal;
