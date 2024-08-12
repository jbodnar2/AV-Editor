/**
 *
 */

// ----- Variables ----- //

// Get the media element and update its attributes
// - Using Object.assign() for setting attributes only because I find it easier
//   to reach when setting multiple attributes on an aelement
const mediaElement = document.querySelector("video");
Object.assign(mediaElement, {
  controls: true,
  // autoplay: true,
  muted: true,
  loop: true,
  poster: "media/images/01.jpeg",
  src: "media/audio-video/newscast.mp4",
  playbackRate: "4.0",
});

// Get the wrapping element into which I'll render the captions
const captionsElement = document.querySelector("#captions");

// Create a map for the cues (keys) and (cueElements) values.
// - Using a map because keys/values can be anything. Key and values will be
//  "live" elements so updating one will update the element or values and
//  consequently update the UI
const cuesMap = new Map();

// ----- Functions ----- //

/**
 * Finds the key associated with a given value in a map.
 * - Various options are just 'cause and to eventually test for efficiency
 * - This function definition is unnecessary if I only need it once
 *
 * @param {Map} map - The map to search in.
 * @param {*} value - The value to search for.
 * @return {*} The key associated with the value, or null if not found.
 */
function findKeyByValue(map, value) {
  if (!map || !value) return null;
  let result;

  /* --- Option 1a --- */
  result = Array.from(map.entries()).find(([key, val]) => val === value)?.[0] || null;

  /* --- Option 1b --- */
  // result = Array.from(map.entries()).filter(([key, val]) => val === value)[0]?.[0] || null;

  /* --- Option 1c --- */
  // result =
  //   Array.from(map.entries()).reduce((prev, curr) => {
  //     if (curr[1] === value) {
  //       prev.push(curr[0]);
  //     }

  //     return prev;
  //   }, [])?.[0] || null;

  /* --- Option 2 --- */
  // map.forEach((val, key) => {
  //   if (val === value) {
  //     result = key;
  //   }
  // });

  /* --- Option 3 --- */
  // for (let [key, val] of map) {
  //   if (val === value) {
  //     result key;
  //   }
  // }

  return result;
}

// ----- Initial setup & Listeners ----- //

mediaElement.addEventListener("loadeddata", () => {
  const textTracks = mediaElement.textTracks;

  if (!textTracks) return;

  for (const track of textTracks) {
    if (!track.cues) continue;

    let cueCount = 0;
    for (const cue of track.cues) {
      cue.id = cueCount;

      const cueElement = document.createElement("div");
      Object.assign(cueElement, {
        id: `cue-${cueCount}`,
        className: "cue",
        textContent: cue.text,
      });

      cuesMap.set(cue, cueElement);

      cueCount++;
    }
  }

  const fragment = document.createDocumentFragment();

  for (const [cue, element] of cuesMap.entries()) {
    fragment.appendChild(element);

    cue.onenter = () => {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("active");
    };

    cue.onexit = () => {
      element.classList.remove("active");
    };

    element.onclick = () => {
      mediaElement.currentTime = cue.startTime;
    };
  }

  captionsElement.innerHTML = "";
  captionsElement.appendChild(fragment);
});
