import React from "react";
import "./App.css";
import { DOMMessage, DOMMessageResponse, DType, ListMessage, UpdateMessage } from "./types";

function App() {
  const [title, setTitle] = React.useState("");
  const [headlines, setHeadlines] = React.useState<string[]>([]);
  const [list, setList] = React.useState<DType[]>([]);

  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          /**
           * Sends a single message to the content script(s) in the specified tab,
           * with an optional callback to run when a response is sent back.
           *
           * The runtime.onMessage event is fired in each content script running
           * in the specified tab for the current extension.
           */
          /*           chrome.tabs.sendMessage(tabs[0].id || 0, { type: "GET_DOM" } as DOMMessage, (response: DOMMessageResponse) => {
            setTitle(response.title);
            setHeadlines(response.headlines);
          }); */
          chrome.tabs.sendMessage(tabs[0].id || 0, { type: "GET_LIST" } as ListMessage, (response: DType[]) => {
            const _response: DType[] = response.length
              ? response
              : [
                  {
                    name: "",
                    symbol: "",
                    moveStatus: "",
                    value: 0,
                  },
                ];
            setList(_response);
          });
        }
      );
  });

  const addD = () => {
    setList([
      ...list,
      {
        name: "",
        symbol: "",
        moveStatus: "",
        value: 0,
      },
    ]);
  };

  const saveD = () => {
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            {
              type: "UPDATE_LIST",
              data: [
                {
                  name: "tst",
                  symbol: "test",
                  moveStatus: "up",
                  value: 10,
                },
              ],
            } as UpdateMessage,
            (response: { status: string }) => {
              console.log(222, response);
            }
          );
        }
      );
  };

  const onChange = <T extends keyof DType>(index: number, key: T, value: DType[T]) => {
    let newList: DType[] = [...list];
    newList[index][key] = value;
  };

  return (
    <div className="App">
      <h1>Dummy extension</h1>
      <div>
        <ul className="list">
          {list.map((d, index) => (
            <li className="item" key={d.symbol}>
              <input value={d.name} onChange={(event) => onChange(index, "name", event.target.value)} />
              <input value={d.symbol} onChange={(event) => onChange(index, "symbol", event.target.value)} />
              <input value={d.moveStatus} onChange={(event) => onChange(index, "moveStatus", event.target.value)} />
              <input value={d.value} onChange={(event) => onChange(index, "value", Number(event.target.value))} />
            </li>
          ))}
        </ul>
      </div>
      <div onClick={addD} className="addNew">
        Add new
      </div>
      <div onClick={saveD} className="save">
        Save
      </div>
    </div>
  );
}

export default App;
