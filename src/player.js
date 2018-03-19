import Sound from './sound';

class Player {
  constructor() {
    this.sounds = [];
    this.keymap = {};
    this.bindNextKeyTo = undefined;
    window.addEventListener('keypress', (e) => {
      if (!!this.bindNextKeyTo) {
        this.assignKey(this.bindNextKeyTo, e.keyCode);
      } else if (this.keymap.hasOwnProperty(e.keyCode) ) {
        this.keymap[e.keyCode].toggle();
      }
    });
  }

  toggleAssignment(sound) {
    if (this.bindNextKeyTo === sound) {
      this.bindNextKeyTo = undefined;
    } else {
      this.bindNextKeyTo = sound;
    }
  }
  
  assignKey(sound, key) {
    if (this.keymap.hasOwnProperty(key)) {
      this.keymap[key].key = undefined;
    }
    if (sound.key) {
      delete this.keymap[sound.key];
    }
    sound.key = key;
    this.keymap[key] = sound;
    if (this.bindNextKeyTo === sound) {
      this.bindNextKeyTo = undefined;
    }
    localStorage.setItem(sound.path, key);
  }

  add(path) {
    if (this.sounds.some(s => s.path === path)) {
      return;
    }
    const sound = new Sound(path);
    const key = localStorage.getItem(path);
    if (key && !this.keymap.hasOwnProperty(key)) {
      this.assignKey(sound, key)
    }
    this.sounds.push(sound);
    return sound;
  }

  remove(sound) {
    if (sound.key) {
      delete this.keymap[sound.key];
    }
    sound.destroy();
    this.sounds = this.sounds.filter(s => s !== sound);
  }

}

export default new Player();
