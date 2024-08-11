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
  autoplay: true,
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

function findKeyByValue(map, value) {
  if (!map || !value) return null;
  let result;

  /* --- Option 1a --- */
  // result = Array.from(map.entries()).find(([key, val]) => val === value)?.[0] || null;

  /* --- Option 1b --- */
  // result = Array.from(map.entries()).filter(([key, val]) => val === value)[0]?.[0] || null;

  /* --- Option 1c --- */
  result =
    Array.from(map.entries()).reduce((prev, curr) => {
      if (curr[1] === value) {
        prev.push(curr[0]);
      }

      return prev;
    }, [])?.[0] || null;

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

  console.log(result);
  return result;
}

// ----- Initial setup & Listeners ----- //

//
mediaElement.addEventListener("loadeddata", event => {
  const textTracks = mediaElement.textTracks;
  if (!textTracks) return;

  for (const track of textTracks) {
    if (!track.cues) return;

    let count = 0;
    for (const cue of track.cues) {
      const cueElement = document.createElement("div");
      Object.assign(cueElement, {
        id: `cue-${count++}`,
        textContent: cue.text,
      });

      cuesMap.set(cue, cueElement);

      const frag = document.createDocumentFragment();

      cuesMap.forEach(entry => frag.append(entry));
      captionsElement.append(frag);

      cue.onenter = event => {
        const cue = cuesMap.get(event.target);
        cue.scrollIntoView({ behavior: "smooth", block: "center" });
        cue.classList.add("active");
      };

      cue.onexit = event => {
        const cue = cuesMap.get(event.target);
        cue.classList.remove("active");
      };
    }
  }
});

document.addEventListener("click", event => {
  const cueElement = event.target;
  if (!cueElement.matches('[id^="cue-"]')) return;

  const cue = findKeyByValue(cuesMap, cueElement);
  if (!cue) return;

  mediaElement.currentTime = cue.startTime;
});

// textTracks.onchange = () => {
//   for (const track of textTracks) {
//     track.oncuechange = event => {
//       const activeCue = event.target?.activeCues[0];
//       const cueText = activeCue?.text;

//       if (!cueText) return;

//       const cueElement = cues.get(activeCue) ?? document.createElement("div");
//       cueElement.textContent = cueText;
//       cueElement.id = `cue-${activeCue.id}`;
//       cueElement.className = "line";
//       cues.set(activeCue, cueElement);

//       captionsElement.append(cueElement);

//       if (cueElement.nextElementSibling) {
//         cueElement.nextElementSibling.classList.remove("active");
//       }

//       cueElement.classList.add("active");

//       const firstChild = captionsElement.firstElementChild;
//       if (firstChild && firstChild !== cueElement) {
//         captionsElement.removeChild(firstChild);
//       }

//       cueElement.scrollIntoView({ behavior: "smooth", block: "end" });
//     };
//   }
// };
