/**
 * Saves the given media data to the session storage.
 *
 * @param {Object} value - The media data to be saved.
 */
function setSessionMedia(value) {
  // Convert the media data to a JSON string and store it in the session storage.
  // The key used to store the media data is "media".
  sessionStorage.setItem("media", JSON.stringify(value));
}

/**
 * Retrieves the media data stored in the session storage.
 *
 * The function attempts to parse the JSON string stored under the key "media"
 * in the session storage. If successful, the parsed media data is returned.
 * Otherwise, null is returned.
 *
 * @return {Object|null} The media data stored in the session storage, or null if
 *                       there is no data or the data cannot be parsed.
 */
function getSessionMedia() {
  try {
    // Attempt to retrieve the media data from the session storage
    const mediaData = sessionStorage.getItem("media");

    // If the media data is not found, return null
    if (!mediaData) {
      return null;
    }

    // Parse the media data from the JSON string and return it
    return JSON.parse(mediaData);
  } catch (error) {
    // If the media data cannot be parsed, log a warning and return null
    console.warn(error);
    return null;
  }
}

/**
 * Deletes the media data stored in the session storage.
 *
 * This function removes the media data stored under the key "media"
 * in the session storage.
 */
function deleteSessionMedia() {
  // Remove the media data from the session storage
  sessionStorage.removeItem("media");
}

/**
 * Saves a media item to the session storage.
 *
 * This function takes an ID and a value representing a media item, and
 * stores them in the session storage. The ID is used as the key to store the
 * value in the session storage.
 *
 * @param {string|number} id - The ID of the media item.
 * @param {Object} value - The media item to be stored.
 */
function setSessionMediaItem(id, value) {
  // Construct the key for storing the media item in the session storage
  const key = `media-${id}`;

  // Store the media item as a JSON string in the session storage
  sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves a media item from the session storage.
 *
 * This function extracts a media item from the session storage based on the provided ID.
 * It constructs a key by concatenating the string "media-" with the ID and retrieves
 * the item from the session storage. If the item exists, it is parsed from a JSON string
 * and returned. Otherwise, null is returned.
 *
 * @param {string|number} id - The ID of the media item.
 * @return {Object|null} The media item if it exists in the session storage, null otherwise.
 */
function getSessionMediaItem(id) {
  // Construct the key based on the provided ID
  const key = `media-${id}`;

  try {
    // Retrieve the item from the session storage
    const item = sessionStorage.getItem(key);

    // If the item exists, parse it from a JSON string and return it
    return item ? JSON.parse(item) : null;
  } catch (error) {
    // If the item cannot be parsed, log a warning and return null
    console.warn(error);
    return null;
  }
}

/**
 * Deletes a media item from the session storage.
 *
 * This function receives an ID and constructs a key by concatenating the string
 * "media-item-" with the ID. It then removes the corresponding item from the
 * session storage.
 *
 * @param {string|number} id - The ID of the media item to be deleted.
 */
function deleteSessionMediaItem(id) {
  // Construct the key based on the provided ID
  const key = `media-${id}`;

  // Remove the media item from the session storage
  sessionStorage.removeItem(key);
}

/**
 * Saves a media item to the local storage.
 *
 * This function takes an ID and a value representing a media item, and
 * stores them in the local storage. The ID is used as the key to store the
 * value in the local storage. The value is stringified before being stored.
 *
 * @param {string|number} id - The ID of the media item.
 * @param {Object} value - The media item to be stored.
 */
function setLocalMediaItem(id, value) {
  // Construct the key for storing the media item in the local storage
  const key = `media-${id}`;

  // Convert the media item to a JSON string and store it in the local storage
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves a media item from the local storage.
 *
 * This function takes an ID and constructs a key by concatenating the string
 * "media-item-" with the ID. It then retrieves the corresponding item from the
 * local storage and parses it from a JSON string. If the item exists, it is
 * returned. Otherwise, null is returned.
 *
 * @param {string|number} id - The ID of the media item.
 * @return {Object|null} The media item if it exists in the local storage, null otherwise.
 */
function getLocalMediaItem(id) {
  // Construct the key based on the provided ID
  const key = `media-${id}`;

  try {
    // Retrieve the item from the local storage
    const item = localStorage.getItem(key);

    // If the item exists, parse it from a JSON string and return it
    return item ? JSON.parse(item) : null;
  } catch (error) {
    // If the item cannot be parsed, log a warning and return null
    console.warn(error);
    return null;
  }
}

/**
 * Deletes a media item from the local storage.
 *
 * @param {string|number} id - The ID of the media item to be deleted.
 */
function deleteLocalMediaItem(id) {
  // Construct the key based on the provided ID
  const key = `media-${id}`;

  // Remove the media item from the local storage
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
