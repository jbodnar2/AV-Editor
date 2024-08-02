function getWordProbabilities(wordList) {
  if (!wordList) {
    return;
  }

  const probabilities = wordList.map(word => word.probability);
  const averageProbability = calculateAverageProbability(probabilities);
  const minimumProbability = Math.min(...probabilities);
  const maximumProbability = Math.max(...probabilities);

  return {
    average: averageProbability,
    minimum: minimumProbability,
    maximum: maximumProbability,
  };
}

function calculateAverageProbability(probabilitiesArray) {
  const sum = probabilitiesArray.reduce((total, currentProbability) => total + currentProbability, 0);
  const averageProbability = sum / probabilitiesArray.length;
  return averageProbability;
}

function formatTime(totalSeconds) {
  const hours = String(Math.floor(totalSeconds / 3600) % 24).padStart(2, "0");
  const minutes = String(Math.floor(totalSeconds / 60) % 60).padStart(2, "0");
  const seconds = String(Math.round(totalSeconds % 60)).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function addTrack(videoElement, transcript) {
  const track = videoElement.addTextTrack("captions", transcript.label, transcript.language);
  track.mode = "showing";
  track.edited = false;

  const cues = transcript.segments.map(segment => {
    const { id, start, end, text, words } = segment;

    const cue = new VTTCue(start, end, text.trim());
    cue.id = id;
    cue.startTimeFormatted = formatTime(start);
    cue.endTimeFormatted = formatTime(end);

    if (words) {
      const wordProbabilities = getWordProbabilities(words);
      cue.avgProbability = wordProbabilities.average;
      cue.maxProbability = wordProbabilities.maximum;
      cue.minProbability = wordProbabilities.minimum;
    }

    track.addCue(cue);

    return cue;
  });

  return { track, cues };
}

export { addTrack };
