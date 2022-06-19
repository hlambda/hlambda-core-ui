import React from 'react';
import useFetch from 'use-http';

import Container from '@mui/material/Container';
import TopBar from './../components/top-bar';

import Terminal, {
  ColorMode,
  LineType,
} from './../components/my-terminal/index.js';

function Commands() {
  const { get, post, response, loading, error } = useFetch();

  const [terminalName, setTerminalName] = React.useState('...');
  const [terminalLineData, setTerminalLineData] = React.useState([]);
  const [inputHistory, setInputHistory] = React.useState(['']);

  // const [terminalState, setTerminalState] = React.useState({
  //   inputStr: '',
  // });

  // const _triggerMe = (inputStr) => {
  //   console.log(inputStr);
  //   setTerminalState({...terminalState, inputStr})
  //   this.setState({inputStr});
  // }

  const fetchCurrentWorkingDir = async (terminalInput) => {
    const results = await get('/console/api/v1/command-cwd');
    const outputString = results?.data ? results?.data : 'Error...';
    return { terminalInput, outputString };
  };

  React.useEffect(() => {
    fetchCurrentWorkingDir().then(({ terminalInput, outputString }) => {
      setTerminalLineData([
        ...terminalLineData,
        { type: LineType.Output, value: outputString },
      ]);
      setTerminalName(outputString);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _executeCommand = async (terminalInput) => {
    if (terminalInput === '') {
      setTerminalLineData([
        ...terminalLineData,
        { type: LineType.Input, value: terminalInput },
        { type: LineType.Output, value: 'empty command ?' },
      ]);
      return;
    }

    if (
      ['clear', 'cls', 'exit', 'quit'].includes(terminalInput.toLowerCase())
    ) {
      setTerminalLineData([]);
      return;
    }

    if (['history'].includes(terminalInput.toLowerCase())) {
      // Todo: maybe in future pull history from the server side... dnno...
      // const results = await post('/console/api/v1/command-history');
      // const outputString = results?.data ? results?.data : 'Error...';
      // setTerminalLineData([
      //   ...terminalLineData,
      //   { type: LineType.Input, value: terminalInput },
      //   { type: LineType.Output, value: outputString },
      // ]);
      setTerminalLineData([
        ...terminalLineData,
        { type: LineType.Input, value: terminalInput },
        {
          type: LineType.Output,
          value: inputHistory.reduce((acc, item, index) => {
            if (index === 0) {
              return acc;
            }
            return acc + `${index}  ${item}\n`;
          }, ''),
        },
      ]);
      return;
    }

    if (terminalInput.toLowerCase().startsWith('cd')) {
      const t = terminalInput.match(/cd\s(.+)/);
      const results = await post('/console/api/v1/command-change-dir', {
        path: t[1],
      });
      const outputString = results?.data ? results?.data : 'Error...';
      setTerminalLineData([
        ...terminalLineData,
        { type: LineType.Input, value: terminalInput },
        { type: LineType.Output, value: outputString },
      ]);
      setTerminalName(outputString);
      return;
    }

    if (['pwd', '?', '??', 'help'].includes(terminalInput.toLowerCase())) {
      fetchCurrentWorkingDir(terminalInput).then(
        ({ terminalInput, outputString }) => {
          setTerminalLineData([
            ...terminalLineData,
            { type: LineType.Input, value: terminalInput },
            { type: LineType.Output, value: outputString },
          ]);
          setTerminalName(outputString);
        }
      );
      return;
    }

    // Do things...
    const results = await post('/console/api/v1/command-request', {
      command: terminalInput,
    });

    console.log(results);

    const outputString = results?.data ? results?.data : 'Error...';

    setTerminalLineData([
      ...terminalLineData,
      { type: LineType.Input, value: terminalInput },
      { type: LineType.Output, value: outputString },
    ]);

    console.log(`New terminal input received: '${terminalInput}'`);
  };

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        <div className="container">
          <Terminal
            name={terminalName}
            colorMode={ColorMode.Dark}
            lineData={terminalLineData}
            onInput={_executeCommand}
            inputHistory={inputHistory}
            setInputHistory={setInputHistory}
          />
        </div>
      </Container>
    </>
  );
}

export default Commands;
