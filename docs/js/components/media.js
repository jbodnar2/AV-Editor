import { getMediaItem } from "./api.js";
import { addTrack } from "./tracks.js";

function showNoMediaMessage() {
  // Get the main element
  const mainElement = document.querySelector("main");

  // Set the innerHTML of the main element to the warning message
  mainElement.innerHTML = `
    <div class="info info--warning">
      Sorry. The item you're looking for isn't available.
      You can <a href="/">browse our library</a> for a different item.
    </div>
  `;
}

function renderControls(id, mediaWrapper) {
  // Create the controls?
  const controls = document.createElement("div");
  Object.assign(controls, {
    id: `controls-${id}`, // Set the controls ID
    class: "controls", // Set the controls class
  });
  controls.innerHTML = `
  <fieldset>
    <legend>Settings</legend>
    <div>
      <input type="checkbox" id="show-problems" name="problems" />
      <label for="show-problems">Mark low-probability segments?</label>
    </div>
  </fieldset>`;

  mediaWrapper.appendChild(controls);
  return controls;
}

async function renderMedia(pageTitle, mediaWrapper) {
  // Fetch the media item
  const mediaItem = await getMediaItem();

  // If the media item is not found, show a warning message and return
  if (!mediaItem) {
    showNoMediaMessage();
    return;
  }

  // Destructure the media item properties
  const { id, title, url, poster, transcript } = mediaItem;

  // Create a video element and set its attributes
  const video = document.createElement("video");
  Object.assign(video, {
    controls: true, // Enable video controls
    poster: poster, // Set the poster image URL
    src: url, // Set the video source URL
    id: `video-${id}`, // Set the video ID
    preload: "auto", // Set the preload attribute
    height: 300, // Set the height of the video
  });

  // Add the track and get the track and cues
  addTrack(video, transcript);

  // Update the page title
  pageTitle.textContent = title;
  document.title = `${title} | ${document.title}`;

  // Clear the media wrapper and append the video element
  mediaWrapper.textContent = "";
  mediaWrapper.appendChild(video);

  // Render the controls for video
  const controls = renderControls(id, mediaWrapper);

  // Return an object containing the transcript, media item ID and video element
  return { transcript, id, video, controls };
}

export { renderMedia };
