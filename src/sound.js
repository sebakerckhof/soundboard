import path from 'path';
import { mimeTypes } from './files';


export default class Sound {
  constructor(file, key) {
    this.path = file;
    this.key = key;
    this.playing = false;
    this.error = false;
    this.title = path.basename(file, path.extname(file));
    
    this._setPlaying = () => { this.playing = true; }
    this._setPaused = () => { this.playing = false; }
    this._setError = (error) => { this.error = true; }

    this.audio = new Audio();
   
    this.audio.addEventListener('playing', this._setPlaying);
    this.audio.addEventListener('ended', this._setPaused);
    this.audio.addEventListener('pause', this._setPaused);
    this.audio.addEventListener('waiting', this._setPaused);
    this.audio.addEventListener('error', this._setError);

    try {
      this.audio.src = this.path;
    } catch (error) {
      this._setError(error);
    }
  }

  get char() {
    return this.key && String.fromCharCode(this.key);
  }

  destroy() {
    this.stop();
    if (this.audio) {
      this.audio.removeEventListener('playing', this._setPlaying);
      this.audio.removeEventListener('ended', this._setPaused);
      this.audio.removeEventListener('pause', this._setPaused);
      this.audio.removeEventListener('waiting', this._setPaused);
      delete this.audio;
    }
  }

  toggle() {
    this.playing ? this.stop() : this.play();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  play() {
    this.audio.currentTime = 0;
    this.audio.play();
  }
}