<template>
  <main>
    <nav class="nav-extended">
      <div class="nav-content container">
        <span class="nav-title">Soundboard</span>
        <a class="btn-floating btn-large halfway-fab waves-effect waves-light teal" v-bind:class="{ pulse: !player.sounds.length }" v-on:click="addDirectory">
          <i class="material-icons">add</i>
        </a>
    </div>
  </nav>
    <div class="container">
    <!-- <a class="waves-effect waves-light btn" v-on:click="addDirectory" v-bind:class="{ pulse: !player.sounds.length }">Add Directory</a>
    <a class="waves-effect waves-light btn" v-on:click="addFiles" v-bind:class="{ pulse: !player.sounds.length }">Add individual files</a> -->
    <p v-if="player.sounds.length === 0"><a class="waves-effect waves-light btn" v-on:click="addDirectory" v-bind:class="{ pulse: !player.sounds.length }">Add Directory</a></p>
    <ul v-else class="collection" style="margin-top:20px">
      <li class="collection-item" v-for="sound in player.sounds" v-bind:class="{ 'teal lighten-4': sound.playing }">
        <a class="waves-effect waves-light btn" v-on:click="sound.toggle()">
          <i class="material-icons" v-if="sound.playing">pause</i>
          <i class="material-icons" v-else>play_arrow</i>
          </a>
        <a class="waves-effect waves-light btn" v-bind:class="{ pulse: player.bindNextKeyTo === sound, blue: player.bindNextKeyTo === sound }" v-on:click="player.toggleAssignment(sound)">
          <span v-if="sound.key">{{ sound.char }}</span>
          <i class="material-icons" v-else>mode_edit</i>
          </a>
        {{sound.title}}
        <a class="waves-effect waves-light btn red secondary-content" v-on:click="player.remove(sound)">
          <i class="material-icons">delete</i>
        </a>
      </li>
    </ul>
  </div>
  </main>
</template>

<script>
import fs from "fs";
import { remote } from "electron";
import path from "path";
import pify from "pify";
import player from "./player";
import { extensions } from './files';

const { dialog } = remote;

const openDialog = pify(dialog.showOpenDialog.bind(dialog), {
  errorFirst: false
});

export default {
  name: "soundboard",
  components: {},
  data: () => ({
    player
  }),
  methods: {
    async addDirectory() {
      this.add(await this.selectDirectory());
    },
    async addFiles() {
      this.add(await this.selectFiles());
    },
    async selectDirectory() {
      const directories = await openDialog({
        title: "Select sounds directory",
        buttonLabel: "Open",
        properties: ["openDirectory"]
      });

      if (Array.isArray(directories)) {
        const [directory] = directories;
        const files = await pify(fs.readdir.bind(fs))(directory);
        return files.filter(f => extensions.includes(path.extname(f).substr(1))).map(f => path.join(directory, f));
      }
      return [];
    },
    selectFiles() {
      return openDialog({
        title: "Select sounds directory",
        buttonLabel: "Open",
        properties: ["openFiles", "multiSelections"],
        filters: [{ name: "Sounds", extensions }]
      });
    },
    add(files = []) {
      files.forEach(player.add.bind(player));
    }
  }
};
</script>
