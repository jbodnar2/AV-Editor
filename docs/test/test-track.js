function addTrackAndCues(mediaElement, mediaData) {
  if (!mediaElement) return;
  if (!mediaData) return;

  // TODO: Investigate track.kind options and how it might affect, loading, downloads, etc
  // NOTE: Default is metadata, c.f. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
  const trackData = mediaData.track;
  const track = mediaElement.addTextTrack(trackData.kind, trackData.label, trackData.srclang);
  track.mode = "showing";

  for (const cueData of trackData.cues) {
    const { start, end, text } = cueData;

    const cue = new VTTCue(start, end, text);
    track.addCue(cue);
  }
}

function addMediaDataAndTrack(mediaElement, mediaData) {
  if (!mediaElement) return;
  if (!mediaData) return;

  let { id, src, title } = mediaData;

  const isGithub = window.location.pathname.includes("AV-Editor");

  // Add the prefix to the URL if it's on GitHub
  if (isGithub) {
    if (!src.startsWith("https://static.library.gsu.edu/")) {
      src = `/AV-Editor${src}`;
    }
  }
  console.log("src", src);

  Object.assign(mediaElement, {
    id,
    src,
    title,
    // autoplay: true,
    // muted: true,
    loop: true,
    controls: true,
    playsInline: true,
    preload: "auto",
    // crossOrigin: "anonymous",
  });

  addTrackAndCues(mediaElement, mediaData);
}

export { addMediaDataAndTrack };
