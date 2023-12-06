// 封装与sessionStorage相关的存储操作

function setSession(key, data) {
  sessionStorage.setItem(String(key), JSON.stringify(data))
}

function getSession(key) {
  return JSON.parse(sessionStorage.getItem(String(key)))
}

function removeSession(key) {
  sessionStorage.removeItem(String(key))
}

export {
  setSession,
  getSession,
  removeSession
}