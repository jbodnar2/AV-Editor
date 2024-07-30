class AVWriter extends HTMLElement {
  static get observedAttributes() {
    return ["source", "text-url", "poster", "playback-rate", "show-probabilities", "show-transcript", "show-controls"];
  }

  constructor() {
    super();

    const elemId = crypto.randomUUID().substring(0, 5);
    const videoId = `video-${elemId}`;
    const transcriptId = `transcript-${elemId}`;

    this.innerHTML = `
    <style>
      av-writer {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 1rem;
      margin-top: 1rem;
      }

      video {
      display: block;
      width: 400px;
      height: auto;
      }

      form {
      flex-grow: 1;
      }

      input {
      width: 100%;
      border: none;
      padding: none;
      font-size: 1rem;
      }

      *:focus {
      outline: 3px solid dodgerblue;
      outline-offset: 3px;
      }

      button {
      background: transparent;
      border: 1px solid lightgray;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      }

      .transcript-wrapper {
      padding: 1rem;
      height: 300px;
      overflow-y: scroll;
      border: 1px solid lightgray;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      }

      .cue--focus {
      .cue-select-button {
      background-color: #111;
      color: white;
      border-color: black;
      }
      }

      .cue-pause-button {
      display: none;
      }

      .cue-play-button::after {
      content: "▶";
      }

      .is-playing {
      .cue-play-button::after {
      content: "⏸";
      /* display: none; */
      }

      .cue-pause-button {
      display: none;
      }
      }

      .cue {
      margin-block-end: 1rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 0.25em;
      }

      .cue-average-probability:not(:empty) {
      font-size: 0.75em;
      background-color: #111;
      padding: .25em .5em;
      border-radius: 5px;
      color: white;
      }

    </style>
    <video id="${videoId}"></video>
    <div id="${transcriptId}" class="transcript-wrapper"></div>
    `;

    this.id = elemId;

    this.videoElement = this.querySelector(`#${videoId}`);
    this.transcriptElement = this.querySelector(`#${transcriptId}`);

    this.videoSource = this.getAttribute("source");
    this.transcriptURL = this.getAttribute("transcript-url");
    this.posterImage = this.getAttribute("poster");
    this.playbackRate = this.getAttribute("playback-rate");
    this.showTranscript = this.getAttribute("show-transcript") === "true" ? "showing" : "";
    this.showProbabilities = this.getAttribute("show-probabilities") === "true" ? true : false;
    this.showControls = this.getAttribute("show-controls") === "true" ? true : false;
    this.track;
  }

  connectedCallback() {
    this.videoElement.src = this.videoSource;
    this.videoElement.controls = this.showControls;
    this.videoElement.poster = this.posterImage;
    this.videoElement.playbackRate = this.playbackRate;

    this.getTrackJSON(this.transcriptURL).then(data => {
      this.addTrack(data);
      this.addTranscript();
      this.track.addEventListener("cuechange", this.focusCueSegment.bind(this));
      this.transcriptElement.addEventListener("click", this.playPauseMedia.bind(this));
      this.videoElement.addEventListener("playing", this.updatePlayState.bind(this));
      this.videoElement.addEventListener("pause", this.updatePlayState.bind(this));
    });
  }

  updatePlayState(event) {
    const isPlaying = !this.videoElement.paused;
    this.transcriptElement.classList.toggle("is-playing", isPlaying);
  }

  playPauseMedia(event) {
    this.setToTime(event);
    const isPlaying = !this.videoElement.paused;
    this.transcriptElement.classList.toggle("is-playing", isPlaying);

    if (!event.target.matches(".cue-play-button, .cue-pause-button")) return;

    isPlaying ? this.videoElement.pause() : this.videoElement.play();
  }

  setToTime(event) {
    const cueTime = event.target.closest("[data-cue]").dataset.startTime || null;
    if (!cueTime) return;

    this.videoElement.currentTime = cueTime;
  }

  async getTrackJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}, ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(error);
    }
  }

  addTrack(trackData) {
    this.track = this.videoElement.addTextTrack("captions", "English", "English");
    this.track.mode = this.showTranscript;

    trackData.segments.forEach(({ id, start, end, text, words } = segment) => {
      const cue = new VTTCue(start, end, text);
      cue.id = id;
      cue.formattedTime = AVWriter.getFormattedTimeFromSeconds(start);

      if (this.showProbabilities && words) {
        const probabilities = words.map(word => word.probability);
        const averageProbability = probabilities.reduce((acc, prob) => acc + prob, 0) / probabilities.length;
        const maxProbability = Math.max(...probabilities);
        const minProbability = Math.min(...probabilities);
        const medianProbability = this.findMedian(probabilities);

        cue.averageProbability = Math.round(averageProbability * 10000) / 100;
        cue.medianProbability = Math.round(medianProbability * 10000) / 100;
        cue.minProbability = Math.round(minProbability * 10000) / 100;
        cue.maxProbability = Math.round(maxProbability * 10000) / 100;
      }

      this.track.addCue(cue);
    });
  }

  findMedian(array) {
    const sortedArray = array.sort((a, b) => a - b);
    const middle = Math.floor(sortedArray.length / 2);
    return sortedArray.length % 2 ? sortedArray[middle] : (sortedArray[middle - 1] + sortedArray[middle]) / 2;
  }

  addTranscript() {
    const cues = Array.from(this.track.cues);
    const content = cues
      .map(
        ({
          id,
          text,
          startTime,
          endTime,
          formattedTime,
          averageProbability,
          minProbability,
          maxProbability,
          medianProbability,
        } = cue) => {
          return `
      <div 
        id="cue-${id}" 
        data-cue="${id}" 
        data-start-time="${startTime}" 
        data-end-time="${endTime}" 
        data-average-probability="${averageProbability || ""}" 
        data-min-probability="${minProbability || ""}" 
        data-max-probability="${maxProbability || ""}" 
        data-median-probability="${medianProbability || ""}"
        class="cue">
        <div class="cue-controls" >
          <button class="cue-select-button">${formattedTime}</button>
          <!--<button class="cue-pause-button" aria-label="Pause">⏸</button> -->
          <button class="cue-play-button" aria-label="Play"></button>
        </div>
        <form action="javascript:void(0);" method="" class="cue-form">
          <input 
            type="text"
            class="cue-input"
            value="${text}" />
            </form>
            ${
              this.showProbabilities
                ? `<span class="cue-average-probability">${averageProbability ? `Avg: ${averageProbability}%` : ""}</br>${minProbability ? `Min: ${minProbability}%` : ""}</br>${maxProbability ? `Max: ${maxProbability}%` : ""}</br>${medianProbability ? `Median: ${medianProbability}%` : ""}</span>`
                : ""
            }
      </div>`;
        },
      )
      .join("");

    this.transcriptElement.innerHTML = content;
  }

  focusCueSegment(event) {
    if (!event.target.activeCues[0]) return;

    const previousCues = this.querySelectorAll(".cue--focus");

    if (previousCues) {
      previousCues.forEach(previousCue => {
        previousCue.classList.remove("cue--focus");
        previousCue.querySelector(".cue-select-button").classList.toggle("cue-select-button--playing");
      });
    }

    const scrollTargetID = `cue-${event.target.activeCues[0].id}`;
    const scrollTarget = this.querySelector(`#${scrollTargetID}`);
    const timeButton = scrollTarget.querySelector(".cue-select-button");

    const isPlaying = !this.videoElement.paused;

    scrollTarget.classList.add("cue--focus");
    timeButton.classList.toggle("cue-select-button--playing", isPlaying);

    scrollTarget.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  static getFormattedTimeFromSeconds(seconds) {
    const hours = (Math.floor(seconds / 3600) % 24).toString().padStart(2, "0");
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    seconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
}

customElements.define("av-writer", AVWriter);
