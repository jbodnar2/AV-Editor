const cueTemplate = document.createElement("template");

cueTemplate.innerHTML = `
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
      <button id="time-button" class="button cue-select-button">
        <span class="start-time">00:00:02</span><span class="end-time"> - 00:00:02 </span>
      </button>
      <button id="play-pause-button" class="button cue-play-button" aria-label="Play and Pause"></button>
    </div>
    <textarea id="cue-text" name="cue-text" class="cue-text" rows="" cols="">$text</textarea>
  </div>
`;

function addTranscript({ track, cues, itemId, editorWrapper }) {
  const transcriptForm = document.createElement("form");
  transcriptForm.id = `transcript-form-${itemId}`;
  transcriptForm.className = "cue-form";

  cues.forEach(cue => {
    const { id, startTime, endTime, avgProbability, minProbability, startTimeFormatted, endTimeFormatted, text } = cue;

    const clone = cueTemplate.content.cloneNode(true);
    const cueWrapper = clone.getElementById("cue-wrapper");
    const timeButton = clone.getElementById("time-button");
    const cueText = clone.getElementById("cue-text");

    cueWrapper.id = `cue-${id}`;
    cueWrapper.dataset.cue = id;
    cueWrapper.dataset.startTime = startTime;
    cueWrapper.dataset.endTime = endTime;
    cueWrapper.dataset.avgProb = avgProbability;
    cueWrapper.dataset.minProb = minProbability;
    cueText.id = `cue-text-${id}`;
    cueText.name = `${id}`;

    cueText.value = text;
    timeButton.innerHTML = `<span class="start-time">${startTimeFormatted}</span class="end-time"><span class='end-time'> - ${endTimeFormatted} </span>`;

    transcriptForm.appendChild(clone);
  });

  editorWrapper.appendChild(transcriptForm);
  return transcriptForm;
}

export { addTranscript };
