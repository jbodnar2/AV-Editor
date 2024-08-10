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

function findKeyByValue(map, value) {
  if (!map || !value) return null;

  // More efficient?
  return Array.from(map.entries()).find(([key, val]) => val === value)?.[0] || null;

  // Not sure if the above code, below code, or using Map.prototype.forEach()
  // ...would be more efficient? Better to create a function or not? Will I ever
  // ..perform this operation more than onece?

  // for (let [key, val] of map) {
  //   if (val === value) {
  //     return key;
  //   }
  // }
  // return null;
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

  // const cue = findKeyByValue(cuesMap, cueElement);
  const cue = Array.from(cuesMap.entries()).find(([key, val]) => val === cueElement)?.[0] || null;
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
