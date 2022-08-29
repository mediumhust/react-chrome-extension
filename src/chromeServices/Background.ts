import { DType } from "../types";
import startRequest from "./startRequest";
import { getList } from "./storage";

chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled....");
  scheduleRequest();
  console.log("schedule watchdog alarm to 5 minutes...");
  chrome.alarms.create("watchdog", { periodInMinutes: 1 });
  startRequest();
});

chrome.runtime.onStartup.addListener(() => {
  console.log("onStartup....");
  startRequest();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("Alarm triggered", alarm);
  if (alarm && alarm.name === "watchdog") {
    chrome.alarms.get("refresh", async (alarm) => {
      if (alarm) {
        console.log("Refresh alarm exists. Yay.");
        const currentList: DType[] = await getList();
        console.log(currentList);
        //todo
        startRequest();
      } else {
        console.log("Refresh alarm doesn't exist, starting a new one");
        startRequest();
        scheduleRequest();
      }
    });
  } else {
    startRequest();
  }
});

function scheduleRequest() {
  console.log("schedule refresh alarm to 30 minutes...");
  chrome.alarms.create("refresh", { periodInMinutes: 3 });
}

export {};
