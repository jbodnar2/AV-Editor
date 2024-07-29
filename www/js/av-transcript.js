class AVTranscript extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <video id="video" controls></video>
      <div id="transcript" class="transcript-wrapper"></div>
    `;
    this.video = document.getElementById("video");
    this.track = video.addTextTrack("captions", "English", "English");
    this.source = this.getAttribute("source");
    this.textURL = this.getAttribute("text-url");
    this.poster = this.getAttribute("poster");

    // this.track.mode = "showing";

    this.transcript = document.getElementById("transcript");
  }

  /**
   * Initializes the component by adding an event listener to the track for cue changes
   * and fetching the track JSON from the provided URL. The fetched JSON is then used
   * to add cues to the track.
   *
   * @return {Promise<void>} A Promise that resolves when the track cues have been added.
   */
  connectedCallback() {
    this.video.src = this.source;
    this.video.poster = this.poster;
    this.video.playbackRate = 2.5;

    this.getTrackJSON(this.textURL)
      .then(trackJSON => {
        this.addTrackCues(trackJSON);
        this.addFullTranscript();
      })
      .then(() => {
        this.transcript.addEventListener("click", this.playPauseMedia.bind(this));
        this.video.addEventListener("playing", this.updatePlayStatus.bind(this));
        this.video.addEventListener("pause", this.updatePlayStatus.bind(this));
        this.track.addEventListener("cuechange", this.focusCue.bind(this));
      });
  }

  updatePlayStatus(event) {
    // ...
    const isPlaying = !this.video.paused;
    const transcriptWrapper = this.querySelector(".transcript-wrapper");
    transcriptWrapper.classList.toggle("is-playing", isPlaying);
  }

  /**
   * Toggles the play/pause state of the video.
   *
   * @return {boolean} The new play/pause state of the video.
   */
  playPauseMedia(event) {
    this.setToTime(event);
    const isPlaying = !this.video.paused;
    const transcriptWrapper = this.querySelector(".transcript-wrapper");
    transcriptWrapper.classList.toggle("is-playing", isPlaying);

    if (!event.target.matches(".cue-play-button, .cue-pause-button")) return;

    isPlaying ? this.video.pause() : this.video.play();
  }

  /**
   * Plays the video from the specified time if the clicked element has the data-cue-start attribute.
   *
   * @param {Event} event - The event object that triggered the function.
   * @return {void} This function does not return anything.
   */
  setToTime(event) {
    const cueTime = event.target.closest("[data-cue]").dataset.startTime || null;
    if (!cueTime) return;

    this.video.currentTime = cueTime;
  }

  /**
   * Adds a full transcript to the HTML element with the id "transcript".
   *
   * @return {void}
   */
  addFullTranscript() {
    const cues = Array.from(this.track.cues);
    let content = "";
    cues.forEach(cue => {
      const { id, text, startTime, endTime, formattedTime } = cue;

      const template = `
        <div id="cue-${id}" data-cue="${id}" data-start-time="${startTime}" data-end-time="${endTime}" class="cue">
          <div class="cue-controls" >
            <button class="cue-select-button">${formattedTime}</button>
            <button class="cue-pause-button" aria-label="Pause">⏸</button>
            <button class="cue-play-button" aria-label="Play">▶</button>
          </div>
          <form action="" method="post" class="cue-form">
            <input 
              class="cue-input"
              value="${text}" />
          </form>
        </div>`;

      content += template;
    });

    this.transcript.innerHTML = content;
  }

  /**
   * Focuses on the active cue of the given event.
   *
   * @param {Event} event - The event object.
   * @return {void} This function does not return a value.
   */
  focusCue(event) {
    if (!event.target.activeCues[0]) return;

    const previousCues = document.querySelectorAll(".cue--focus");

    if (previousCues) {
      previousCues.forEach(previousCue => {
        previousCue.classList.remove("cue--focus");
        previousCue.querySelector(".cue-select-button").classList.toggle("cue-select-button--playing");
      });
    }

    const scrollTargetID = `cue-${event.target.activeCues[0].id}`;
    const scrollTarget = document.getElementById(scrollTargetID);
    const timeButton = scrollTarget.querySelector(".cue-select-button");

    const isPlaying = !this.video.paused;

    scrollTarget.classList.add("cue--focus");
    timeButton.classList.toggle("cue-select-button--playing", isPlaying);

    scrollTarget.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /**
   * Asynchronously fetches JSON data from the provided URL and returns it.
   *
   * @param {string} url - The URL to fetch the JSON data from.
   * @return {Promise<Object>} A Promise that resolves to the fetched JSON data.
   * @throws {Error} If the response status is not ok, an error is thrown.
   */
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

  /**
   * Asynchronously fetches JSON data from the provided URL and returns it.
   *
   * @param {Object} trackJSON - The JSON object containing the track data.
   * @return {void} This function does not return anything.
   */
  addTrackCues(trackJSON) {
    trackJSON.segments.forEach(segment => {
      const { id, start, end, text } = segment;

      const cue = new VTTCue(start, end, text);
      cue.id = id;
      cue.formattedTime = AVTranscript.getFormattedTimeFromSeconds(start);
      this.track.addCue(cue);
    });
  }

  static get observedAttributes() {
    return ["source", "text-url", "poster"];
  }

  static converTimeToSeconds(timeString) {
    const [minutes, secondsString] = timeString.split(":");

    const minutesInSeconds = parseFloat(minutes) * 60;

    const seconds = parseFloat(secondsString);

    return minutesInSeconds + seconds;
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

customElements.define("av-transcript", AVTranscript);
