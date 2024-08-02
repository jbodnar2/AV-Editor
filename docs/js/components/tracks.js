/**
 * Calculates the average, minimum, and maximum probabilities of a list of words.
 *
 * @param {Array} wordList - An array of objects containing the word and its probability.
 * @return {Object} An object with the average, minimum, and maximum probabilities.
 */
function getWordProbabilities(wordList) {
  // If the wordList is empty, return undefined.
  if (!wordList) {
    return;
  }

  // Extract the probabilities from the wordList.
  const probabilities = wordList.map(word => word.probability);

  // Calculate the average probability.
  const averageProbability = calculateAverageProbability(probabilities);

  // Find the minimum probability.
  const minimumProbability = Math.min(...probabilities);

  // Find the maximum probability.
  const maximumProbability = Math.max(...probabilities);

  // Return an object with the average, minimum, and maximum probabilities.
  return {
    average: averageProbability,
    minimum: minimumProbability,
    maximum: maximumProbability,
  };
}

/**
 * Calculates the average probability from an array of probabilities.
 *
 * @param {Array} probabilitiesArray - An array of probabilities.
 * @return {number} The average probability.
 */
function calculateAverageProbability(probabilitiesArray) {
  // Calculate the sum of all probabilities in the array.
  const sum = probabilitiesArray.reduce((total, currentProbability) => total + currentProbability, 0);

  // Calculate the average probability by dividing the sum by the number of probabilities.
  const averageProbability = sum / probabilitiesArray.length;

  // Return the average probability.
  return averageProbability;
}

/**
 * Formats the given total number of seconds into a time string in the format HH:MM:SS.
 *
 * @param {number} totalSeconds - The total number of seconds to format.
 * @return {string} The formatted time string in the format HH:MM:SS.
 */
function formatTime(totalSeconds) {
  // Calculate the number of hours
  const hours = String(Math.floor(totalSeconds / 3600) % 24).padStart(2, "0");

  // Calculate the number of minutes
  const minutes = String(Math.floor(totalSeconds / 60) % 60).padStart(2, "0");

  // Calculate the number of seconds
  const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");

  // Return the formatted time string in the format HH:MM:SS
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Adds a text track to a video element with the given transcript.
 *
 * @param {HTMLVideoElement} videoElement - The video element to add the track to.
 * @param {Object} transcript - The transcript object containing the transcript data.
 * @param {string} transcript.label - The label of the track.
 * @param {string} transcript.language - The language of the track.
 * @param {Array} transcript.segments - The array of segments that make up the transcript.
 * @param {Object} transcript.segments[].id - The id of the segment.
 * @param {number} transcript.segments[].start - The start time of the segment in seconds.
 * @param {number} transcript.segments[].end - The end time of the segment in seconds.
 * @param {string} transcript.segments[].text - The text of the segment.
 * @param {Array} [transcript.segments[].words] - The array of words in the segment.
 * @return {Object} An object containing the added track and the cues in the track.
 */
function addTrack(videoElement, transcript) {
  // Create a new text track for the video element and set its properties
  const track = videoElement.addTextTrack("captions", transcript.label, transcript.language);
  track.mode = "showing";
  track.edited = false;

  // Map over the segments in the transcript and create a new VTTCue for each one
  const cues = transcript.segments.map(segment => {
    const { id, start, end, text, words } = segment;

    const cue = new VTTCue(start, end, text.trim());

    // Set the properties of the cue
    cue.id = id;
    cue.startTimeFormatted = formatTime(start);
    cue.endTimeFormatted = formatTime(end);

    // If the segment has words, calculate and set the probabilities of the words
    if (words) {
      const wordProbabilities = getWordProbabilities(words);
      cue.avgProbability = wordProbabilities.average;
      cue.maxProbability = wordProbabilities.maximum;
      cue.minProbability = wordProbabilities.minimum;
    }

    // Add the cue to the track and return it
    track.addCue(cue);
    return cue;
  });

  // Return the track and the array of cues
  return { track, cues };
}

export { addTrack };
