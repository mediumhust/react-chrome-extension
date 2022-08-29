import { ListMessage } from "./../types/DType";
import { DOMMessage, DOMMessageResponse, DType, UpdateMessage } from "../types";
import { getList, updateList } from "./storage";

type ResponseType = DOMMessageResponse | DType[] | { status: string };

const messagesFromReactAppListener = async (msg: DOMMessage | ListMessage | UpdateMessage, sender: chrome.runtime.MessageSender): Promise<ResponseType> => {
  console.log("[content.js]. Message received", msg);

  let response: ResponseType;

  if (msg.type === "GET_DOM") {
    response = {
      title: document.title,
      headlines: Array.from(document.getElementsByTagName<"h1">("h1")).map((h1) => h1.innerText),
    };
  } else if (msg.type === "UPDATE_LIST") {
    console.log(3333, msg.data);
    updateList(msg.data);
    response = { status: "success" };
  } else {
    response = await getList();
  }
  return response;
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener((msg: DOMMessage | ListMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ResponseType) => void) => {
  messagesFromReactAppListener(msg, sender).then(sendResponse);
  return true;
});
