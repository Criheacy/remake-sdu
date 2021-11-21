const readFromLocalStorage = (key: string) => {
  if (global.localStorage) {
    try {
      return JSON.parse(global.localStorage.getItem(key) || "");
    } catch (e) {
      console.error(`Cannot read from local storage! error: ${e}`);
    }
  }
}

const saveToLocalStorage = (key: string, obj: any) => {
  if (global.localStorage) {
    global.localStorage.setItem(key, JSON.stringify(obj));
  }
}

export { readFromLocalStorage, saveToLocalStorage };