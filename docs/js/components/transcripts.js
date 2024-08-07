const cueTemplate = document.createElement("template");

cueTemplate.innerHTML = `
  <div id="cue-notification-id" aria-live="polite" class="cue-notification"></div>
  <div
    id="cue-wrapper"
    class="cue"
    data-cue="id"
    data-start-time="startTime"
    data-end-time="endTime"
    data-avg-prob="avgProb"
    data-min-prob="minProb"
  >
    <div id="cue-controls" class="cue-controls">
      <button id="time-button" class="button cue-select-button" aria-label="Move to time [star time]">
        <span class="start-time">00:00:02</span><span class="end-time"> - 00:00:02 </span>
      </button>
      <button id="play-pause-button" class="button cue-play-button" aria-label="Play and Pause"></button>
    </div>
    <textarea aria-label="edit transcript segment" id="cue-text" name="cue-text" class="cue-text" rows="" cols="">$text</textarea>
  </div>
`;

/**
 * Adds a transcript to an editor wrapper.
 *
 * @param {Object} options - The options for adding the transcript.
 * @param {TextTrack} options.track - The track object for the transcript.
 * @param {Array} options.cues - The array of cues for the transcript.
 * @param {string} options.itemId - The ID for the transcript form.
 * @param {HTMLElement} options.editorWrapper - The wrapper element for the transcript.
 * @returns {HTMLFormElement} The transcript form element.
 */
function addTranscript({ track, cues, itemId, editorWrapper }) {
  const transcriptForm = document.createElement("form");

  // Set the ID and class for the transcript form.
  transcriptForm.id = `transcript-form-${itemId}`;
  transcriptForm.className = "cue-form";

  cues.forEach(cue => {
    // Destructure the cue properties.
    const { id, startTime, endTime, avgProbability, minProbability, startTimeFormatted, endTimeFormatted, text } = cue;

    // Clone the cue template.
    const clone = cueTemplate.content.cloneNode(true);
    // NOTE: Can only select with doc fragments by ID
    const cueNotification = clone.getElementById("cue-notification-id");
    const cueWrapper = clone.getElementById("cue-wrapper");
    const cueControls = clone.getElementById("cue-controls");
    const timeButton = clone.getElementById("time-button");
    const playPauseButton = clone.getElementById("play-pause-button");
    const cueText = clone.getElementById("cue-text");

    // Set the IDs and dataset attributes for the cue wrapper.
    cueNotification.id = `cue-notification-${id}`;
    cueWrapper.id = `cue-${id}`;
    cueWrapper.dataset.cue = id;
    cueWrapper.dataset.startTime = startTime;
    cueWrapper.dataset.endTime = endTime;
    cueWrapper.dataset.avgProb = avgProbability;
    cueWrapper.dataset.minProb = minProbability;
    cueText.id = `cue-text-${id}`;
    cueText.name = `${id}`;

    cueControls.id = `cue-controls-${id}`;

    // Set the value of the cue text input.
    cueText.value = text;

    playPauseButton.id = `play-pause-button-${id}`;

    // Update the innerHTML of the time button.
    timeButton.id = `time-button-${id}`;
    timeButton["aria-label"] = `Move to time [${startTimeFormatted}]`;
    timeButton.innerHTML = `<span class="start-time">${startTimeFormatted}</span class="end-time"><span class='end-time'> - ${endTimeFormatted} </span>`;

    // Append the cloned cue to the transcript form.
    transcriptForm.appendChild(clone);
  });

  // Append the transcript form to the editor wrapper.
  editorWrapper.appendChild(transcriptForm);

  // Return the transcript form.
  return transcriptForm;
}

export { addTranscript };
