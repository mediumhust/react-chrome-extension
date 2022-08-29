import { DType } from "../types";

const KEY_D_LIST = "dList";

const getList = (): Promise<DType[]> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([KEY_D_LIST], (obj) => {
      resolve((obj[KEY_D_LIST] ? JSON.parse(obj[KEY_D_LIST]) : []) as DType[]);
    });
  });
};

const addList = async (d: DType) => {
  let currentList: DType[] = await getList();
  let _index = -1;

  currentList.forEach((_d, index) => {
    if (d.symbol === _d.symbol) _index = index;
  });

  if (_index > -1) {
    currentList[_index] = d;
  } else {
    currentList.push(d);
  }

  chrome.storage.sync.set({
    [KEY_D_LIST]: JSON.stringify(currentList),
  });
};

const updateList = async (list: DType[]) => {
  chrome.storage.sync.set({
    [KEY_D_LIST]: JSON.stringify(list),
  });
};

export { KEY_D_LIST, getList, addList, updateList };
