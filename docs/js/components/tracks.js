// Helper to get avg, min, max from array of nums between 0 and 1
function getWordProbabilities(words) {
  if (!words) return;

  const probabilities = words.map(word => word.probability);
  const avg = Math.round((probabilities.reduce((acc, prob) => acc + prob, 0) / probabilities.length) * 1000) / 1000;
  const min = Math.round(Math.min(...probabilities) * 1000) / 1000;
  const max = Math.round(Math.max(...probabilities) * 1000) / 1000;

  return { avg, min, max };
}

function getFormattedTimeFromSeconds(seconds) {
  const hours = (Math.floor(seconds / 3600) % 24).toString().padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  seconds = Math.round(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function addTrack(video, transcript) {
  const track = video.addTextTrack("captions", transcript.label, transcript.language);
  track.mode = "showing";

  track.edited = false;

  let cues = transcript.segments.map(segment => {
    const { id, start, end, text, words } = segment;

    const cue = new VTTCue(start, end, text.trim());
    cue.id = id;
    cue.formattedTime = getFormattedTimeFromSeconds(start);
    cue.endFormattedTime = getFormattedTimeFromSeconds(end);

    if (words) {
      const { avg, min, max } = getWordProbabilities(words, track.edited);
      cue.avgProb = avg;
      cue.maxProb = max;
      cue.minProb = min;
    }

    track.addCue(cue);

    return cue;
  });

  return { track, cues };
}

export { addTrack };
