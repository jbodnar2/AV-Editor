const mediaElement = document.querySelector("video");
Object.assign(mediaElement, { controls: true, autoplay: "true", muted: true });

const textTracks = mediaElement.textTracks;
const captionsElement = document.querySelector("#captions");
const cues = new Map();

textTracks.onchange = () => {
  for (const track of textTracks) {
    track.oncuechange = event => {
      const activeCue = event.target?.activeCues[0];
      const cueText = activeCue?.text;

      if (!cueText) return;

      const cueElement = cues.get(activeCue) ?? document.createElement("div");
      cueElement.textContent = cueText;
      cueElement.id = `cue-${activeCue.id}`;
      cueElement.className = "line";
      cues.set(activeCue, cueElement);

      captionsElement.prepend(cueElement);

      if (cueElement.nextElementSibling) {
        cueElement.nextElementSibling.classList.remove("active");
      }

      cueElement.classList.add("active");

      const firstChild = captionsElement.firstElementChild;
      if (firstChild && firstChild !== cueElement) {
        captionsElement.removeChild(firstChild);
      }

      cueElement.scrollIntoView({ behavior: "smooth", block: "end" });
    };
  }
};
