//封装和token相关的方法，存 取 删

const TOKEN = 'token'

function setToken(token) {
  const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1小时后的时间戳
  const data = {
    token,
    expirationTime
  };
  localStorage.setItem(TOKEN, JSON.stringify(data))
}

function getToken() {
  const savedData = localStorage.getItem(TOKEN);
  if (savedData) {
    const { token, expirationTime } = JSON.parse(savedData);
    const currentTime = new Date().getTime();
    if (currentTime < expirationTime) {
      return token;
    } else {
      localStorage.removeItem(TOKEN); // 删除过期的 token
    }
  }
  return null;
}

function removeToken() {
  localStorage.removeItem(TOKEN)
}

export {
  setToken,
  getToken,
  removeToken
}