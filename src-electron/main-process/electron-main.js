/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { app, BrowserWindow, nativeTheme, session, ipcMain } from 'electron'
import { esLogin, postReview } from './erogameScape'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

let mainWindow

function createWindow () {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      cancel: false,
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Origin': ['http://localhost:8081'],
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  });
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    useContentSize: true,
    webSecurity: false,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
      webSecurity: false,
    }
  })

  ipcMain.on('es-login', (event, payload) => {
    console.log('main es-login')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    esLogin(payload.id, payload.password).then(header => event.sender.send('es-login-reply', header))
  })

  ipcMain.on('es-review', (event, payload) => {
    console.log('main es-review')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    postReview(payload.id, payload.reviewForm).then(() => { event.sender.send('es-review-reply') })
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
