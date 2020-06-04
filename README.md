# es-client (es-client)

A Quasar Framework app

commands are [here](https://quasar.dev/quasar-cli/developing-electron-apps/build-commands)
## Install the dependencies
```bash
npm install
```

### **debug on electron**
```bash
quasar dev -m electron --modern
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

```
SELECT id, gname, dmm_genre, dmm_genre_2, dmm
FROM gamelist

const games = []
let g = {}
$$("tr > td").map(v => v.innerHTML).forEach((v, i) => {
if (i % 5 === 0) {
if (i !==  0) {
games.push(g)
g = {}
}
g.id = +(v)
} else if (i % 5 === 1) {
g.name = v
} else if (i % 5 === 2) {
g.dmm_genre = v
} else if (i % 5 === 3) {
g.dmm_genre_2 = v
} else {
g.dmm = v
}})
```