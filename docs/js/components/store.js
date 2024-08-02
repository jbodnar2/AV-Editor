function setSessionMedia(value) {
  sessionStorage.setItem("media", JSON.stringify(value));
}

function getSessionMedia() {
  try {
    return JSON.parse(sessionStorage.getItem("media")) || null;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

function deleteSessionMedia() {
  sessionStorage.removeItem("media");
}

function setSessionMediaItem(id, value) {
  const key = `media-item-${id}`;
  sessionStorage.setItem(key, JSON.stringify(value));
}

function getSessionMediaItem(id) {
  const key = `media-item-${id}`;
  try {
    return JSON.parse(sessionStorage.getItem(key)) || null;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

function deleteSessionMediaItem(id) {
  const key = `media-item-${id}`;
  sessionStorage.removeItem(key);
}

function setLocalMediaItem(id, value) {
  const key = `media-item-${id}`;
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalMediaItem(id) {
  const key = `media-item-${id}`;
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

function deleteLocalMediaItem(id) {
  const key = `media-item-${id}`;
  localStorage.removeItem(key);
}

export {
  setSessionMedia,
  getSessionMedia,
  deleteSessionMedia,
  setSessionMediaItem,
  getSessionMediaItem,
  deleteSessionMediaItem,
  setLocalMediaItem,
  getLocalMediaItem,
  deleteLocalMediaItem,
};
