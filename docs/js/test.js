const mediaElement = document.querySelector("video");
Object.assign(mediaElement, {
  controls: true,
  autoplay: "true",
  muted: false,
  loop: true,
  poster: "media/images/01.jpeg",
  src: "media/audio-video/newscast.mp4",
  playbackRate: "2.0",
});

const captionsElement = document.querySelector("#captions");
const cuesMap = new Map();

mediaElement.addEventListener("loadeddata", event => {
  console.log(event.type);
  const textTracks = mediaElement.textTracks;

  for (const track of textTracks) {
    if (!track.cues) break;

    let count = 0;
    for (const cue of track.cues) {
      const cueElement = document.createElement("div");
      Object.assign(cueElement, {
        id: `cue-${count++}`,
        textContent: cue.text,
        style: "margin-bottom: 1rem",
      });

      cuesMap.set(cue, cueElement);

      const frag = document.createDocumentFragment();

      cuesMap.forEach(entry => frag.append(entry));
      captionsElement.append(frag);

      cue.onenter = event => {
        const cue = cuesMap.get(event.target);
        cue.scrollIntoView({ behavior: "smooth" });
        cue.classList.add("active");
      };

      cue.onexit = event => {
        const cue = cuesMap.get(event.target);
        cue.classList.remove("active");
      };
    }
  }
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
