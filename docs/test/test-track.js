function addVideoTrackAndCues(videoElement, mediaData) {
  if (!videoElement) return;
  if (!mediaData) return;

  // TODO: Investigate track.kind options and how it might affect, loading, downloads, etc
  // NOTE: Default is metadata, c.f. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
  const trackData = mediaData.track;
  const track = videoElement.addTextTrack(trackData.kind, trackData.label, trackData.srclang);
  track.mode = "showing";

  for (const cueData of trackData.cues) {
    const { start, end, text, ...remaining } = cueData;

    const cue = new VTTCue(start, end, text.trim());
    Object.assign(cue, remaining);

    track.addCue(cue);
  }
}

function addVideoData(videoElement, mediaData) {
  if (!videoElement) return;
  if (!mediaData) return;

  const { id, src, title, poster } = mediaData;

  Object.assign(videoElement, {
    id,
    src,
    title,
    poster,
  });

  addVideoTrackAndCues(videoElement, mediaData);
}

export { addVideoData };
