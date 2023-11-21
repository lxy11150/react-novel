//封装和token相关的方法，存 取 删

const TOKEN = 'token'

function setToken(token) {
  localStorage.setItem(TOKEN, token)
}

function getToken() {
  return localStorage.getItem(TOKEN)
}

function removeToken() {
  localStorage.removeItem(TOKEN)
}

export {
  setToken,
  getToken,
  removeToken
}