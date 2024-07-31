import { getTranscripts } from "./components/api.js";

getTranscripts("data/av.json").then(console.log);
