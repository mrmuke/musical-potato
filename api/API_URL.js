import Constants from "expo-constants";

const { manifest } = Constants;

const api = `http://${manifest.debuggerHost.split(':').shift()}:8000`;
export default {api}