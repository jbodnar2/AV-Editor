function addTranscript({ track, cues, itemId, editorWrapper }) {
  const cueTemplate = document.querySelector("#cue-template");
  const transcriptForm = document.createElement("form");
  transcriptForm.id = `transcript-form-${itemId}`;
  transcriptForm.className = "cue-form";

  if (cueTemplate) {
    cues.forEach(cue => {
      const { id, startTime, endTime, avgProb, minProb, formattedTime, endFormattedTime, text } = cue;
      const showEndTime = editorWrapper.dataset.showEnd === "true";

      const clone = cueTemplate.content.cloneNode(true);
      const cueWrapper = clone.getElementById("cue-wrapper");
      const cueControls = clone.getElementById("cue-controls");
      const timeButton = clone.getElementById("time-button");
      const playPauseButton = clone.getElementById("play-pause-button");
      const cueText = clone.getElementById("cue-text");

      cueWrapper.id = `cue-${id}`;
      cueWrapper.dataset.cue = id;
      cueWrapper.dataset.startTime = startTime;
      cueWrapper.dataset.endTime = endTime;
      cueWrapper.dataset.avgProb = avgProb;
      cueWrapper.dataset.minProb = minProb;
      cueText.id = `cue-text-${id}`;
      cueText.name = `${id}`;

      cueText.value = text;
      timeButton.textContent = formattedTime;
      timeButton.innerHTML = `<span class="start-time">${formattedTime}</span class="end-time"><span class='end-time'> - ${endFormattedTime} </span>`;

      transcriptForm.appendChild(clone);
    });

    editorWrapper.appendChild(transcriptForm);
    return transcriptForm;
  }

  const cuesHTML = cues
    .map(cue => {
      const { id, startTime, endTime, avgProb, minProb, formattedTime, text } = cue;

      return `
        <div 
            id="cue-${id}" 
            class="cue" 
            data-cue="${id}" 
            data-start-time="${startTime}" 
            data-end-time="${endTime}"
            data-avg-prob="${avgProb}" 
            data-min-prob="${minProb}">
          <div class="cue-controls">
            <button class="button cue-select-button">${formattedTime}</button>
            <button class="button cue-play-button" aria-label="Play and Pause"></button>
          </div>
          <textarea id="cue-${id}-text" name="${id}" class="cue-text" rows="2" cols="">${text}</textarea>
        </div>`;
    })
    .join("");

  transcriptForm.innerHTML = cuesHTML;
  editorWrapper.appendChild(transcriptForm);
  return transcriptForm;
}

export { addTranscript };
