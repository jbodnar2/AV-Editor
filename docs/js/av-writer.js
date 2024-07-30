class AVWriter extends HTMLElement {
  static get observedAttributes() {
    return ["source", "text-url", "poster", "playback-rate"];
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

    </style>
    <video id="${videoId}" controls></video>
    <div id="${transcriptId}" class="transcript-wrapper"></div>
    `;

    this.id = elemId;

    this.videoElement = this.querySelector(`#${videoId}`);
    this.transcriptElement = this.querySelector(`#${transcriptId}`);

    this.videoSource = this.getAttribute("source");
    this.transcriptURL = this.getAttribute("transcript-url");
    this.posterImage = this.getAttribute("poster");
    this.playbackRate = this.getAttribute("playback-rate");
    this.showTranscript = this.getAttribute("show-transcript") === "true" ? "showing" : null;

    // NOTE: We might have multiple tracks in the future.
    this.track;
  }

  connectedCallback() {
    this.videoElement.src = this.videoSource;
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

    trackData.segments.forEach(({ id, start, end, text } = segments) => {
      const cue = new VTTCue(start, end, text);
      cue.id = id;
      cue.formattedTime = AVWriter.getFormattedTimeFromSeconds(start);
      this.track.addCue(cue);
    });
  }

  addTranscript() {
    const cues = Array.from(this.track.cues);
    const content = cues
      .map(({ id, text, startTime, endTime, formattedTime } = cue) => {
        return `
      <div id="cue-${id}" data-cue="${id}" data-start-time="${startTime}" data-end-time="${endTime}" class="cue">
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
      </div>`;
      })
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
