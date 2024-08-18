function addVideoTrackAndCues(videoElement = document.querySelector("video"), mediaData) {
  if (!videoElement) return;
  if (!mediaData) return;

  const trackData = mediaData.track;
  const track = videoElement.addTextTrack(trackData.kind, trackData.label, trackData.srclang);
  track.mode = "showing";

  for (const cueData of trackData.cues) {
    const { id, start, end, text, ...data } = cueData;

    const cue = new VTTCue(start, end, text.trim());
    cue.id = id;
    cue.data = data;

    track.addCue(cue);
  }
}

function addVideoData(videoElement = document.querySelector("video"), mediaData) {
  if (!videoElement) return;
  if (!mediaData) return;

  const { id, src, title, poster } = mediaData;

  Object.assign(videoElement, {
    id,
    src,
    title,
    poster,
    controls: true,
    muted: true,
    loop: true,
    playbackRate: 1.0,
    autoplay: false,
  });

  addVideoTrackAndCues(videoElement, mediaData);
}

export { addVideoData };
