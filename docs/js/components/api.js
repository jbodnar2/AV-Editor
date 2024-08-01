/**
 * Fetches media data from the server and caches it in session storage.
 *
 * This function first checks if the media data is already cached in sessionStorage.
 * If it is, the cached data is returned. If not, the function fetches the media data
 * from the server using the fetch API. If the fetch is successful, the data is cached
 * in sessionStorage and returned. If the fetch fails, null is returned.
 *
 * @return {Promise<Object|null>} The fetched media data or null if the fetch fails.
 */
async function fetchMedia() {
  // Key used to store the media data in sessionStorage
  const cacheKey = "media";

  // Retrieve the cached media data from sessionStorage
  const cachedData = JSON.parse(sessionStorage.getItem(cacheKey));

  // If the media data is already cached, return it
  if (cachedData) {
    return cachedData;
  }

  try {
    // Fetch the media data from the server
    const response = await fetch("data/media.json");

    // If the fetch is not successful, throw an error
    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
    }

    // Parse the fetched JSON data
    const data = await response.json();

    // Cache the media data in sessionStorage
    sessionStorage.setItem(cacheKey, JSON.stringify(data));

    // Return the fetched media data
    return data;
  } catch (error) {
    // If the fetch fails, return null
    return null;
  }
}

/**
 * Extracts the media item ID from the URL.
 *
 * This function gets the current URL, creates a new URL object from it,
 * and then gets the search parameters from that URL. It then uses the
 * `get` method of the URLSearchParams object to get the value of the
 * "id" parameter.
 *
 * @return {string|null} The media item ID if it exists in the URL,
 * otherwise null.
 */
function extractMediaItemIdFromUrl() {
  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Create a new URL object from the current URL
  const url = new URL(currentUrl);

  // Get the search parameters from the URL
  const urlSearchParams = new URLSearchParams(url.search);

  // Get the value of the "id" parameter from the search parameters
  // and return it
  return urlSearchParams.get("id");
}

/**
 * Retrieves a media item from the cache or fetches it from the server.
 *
 * This function first extracts the media item ID from the URL using the
 * `extractMediaItemIdFromUrl` function. If the ID is not found, it returns null.
 *
 * Next, it constructs a cache key using the media item ID and checks if the item
 * is already cached in localStorage or sessionStorage. If the item is not found
 * in the cache, it fetches the media data from the server using the `fetchMedia`
 * function and searches for the media item with the corresponding ID. If the item
 * is found, it is stored in the cache and returned.
 *
 * @return {Promise<Object|null>} The media item if found, null otherwise.
 */
async function getMediaItem() {
  // Extract the media item ID from the URL
  const id = extractMediaItemIdFromUrl();

  // If the ID is not found, return null
  if (!id) {
    return null;
  }

  // Construct the cache key using the media item ID
  const cacheKey = `media-item-${id}`;

  // Check if the item is already cached in localStorage or sessionStorage
  const cache = localStorage.getItem(cacheKey) || sessionStorage.getItem(cacheKey);

  // If the item key is fouund but cached data is corrup, delete bad cache and return null
  if (cache === "undefined") {
    sessionStorage.removeItem(cacheKey);
    localStorage.removeItem(cacheKey);
    return null;
  }

  // Parse the cached item
  let mediaItem = JSON.parse(cache);

  // If the item is not found or is null, fetch the media data and search for the item
  if (!mediaItem || mediaItem === null) {
    const media = await fetchMedia();
    mediaItem = media.find(item => item.id === id);

    // Store the item in the cache
    sessionStorage.setItem(cacheKey, JSON.stringify(mediaItem));
  }

  // Return the media item
  return mediaItem;
}

export { fetchMedia, getMediaItem };
