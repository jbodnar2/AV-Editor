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
// const cuesMap = new Map();

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
  // result = Array.from(map.entries()).find(([key, val]) => val === value)?.[0] || null;

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
  for (let [key, val] of map) {
    if (val === value) {
      result = key;
    }
  }

  return result;
}

// ----- Initial setup & Listeners ----- //

mediaElement.addEventListener("loadeddata", () => {
  const textTracks = mediaElement.textTracks;
  if (!textTracks) return;

  const cuesMap = new Map();
  const fragment = document.createDocumentFragment();

  for (const track of textTracks) {
    const isShowing = track?.mode === "showing";
    const hasCues = track?.cues?.length > 0;

    if (!hasCues || !isShowing) continue;

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

      fragment.appendChild(cueElement);

      cueCount++;
    }

    captionsElement.innerHTML = "";
    captionsElement.appendChild(fragment);
  }

  for (const [cue, element] of cuesMap.entries()) {
    cue.onenter = () => {
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      element.classList.add("cue--current");
    };

    cue.onexit = () => {
      element.classList.remove("cue--current");
    };

    element.onclick = () => {
      mediaElement.currentTime = cue.startTime;
    };
  }

  // --- Doing it all again? --- //
  textTracks.onchange = event => {
    Array.from(textTracks).forEach(track => {
      const isShowing = track?.mode === "showing";
      if (!isShowing) {
        captionsElement.innerHTML = "";
        return;
      }

      const cues = track.cues;
      // A way to do this without the timer?
      setTimeout(() => {
        let cueCount = 0;

        for (const cue of cues) {
          cue.id = cueCount;

          const cueElement = document.createElement("div");
          Object.assign(cueElement, {
            id: `cue-${cueCount}`,
            className: "cue",
            textContent: cue.text,
          });

          cuesMap.set(cue, cueElement);

          fragment.appendChild(cueElement);

          cueCount++;
        }

        captionsElement.innerHTML = "";
        captionsElement.appendChild(fragment);

        const isOnCue = track?.activeCues[0]?.startTime;
        if (isOnCue) {
          mediaElement.currentTime = isOnCue;
          const cueElement = cuesMap.get(track?.activeCues[0]);
          cueElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
          cueElement.classList.add("cue--current");
        }

        for (const [cue, element] of cuesMap.entries()) {
          cue.onenter = () => {
            element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            element.classList.add("cue--current");
          };

          cue.onexit = () => {
            element.classList.remove("cue--current");
          };

          element.onclick = () => {
            mediaElement.currentTime = cue.startTime;
          };
        }
      }, 100);
    });
  };

  // captionsElement.innerHTML = "";
  // captionsElement.appendChild(fragment);
});
