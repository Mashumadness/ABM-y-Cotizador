const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Cada cuánto se vuelve a buscar una versión nueva mientras la app está abierta
const UPDATE_CHECK_INTERVAL_MS = 4 * 60 * 60 * 1000;

// ==========================================
// ACTUALIZACIONES (GitHub Releases)
// ==========================================
// Solo avisa: la descarga empieza cuando la persona acepta.
// Los datos (productos, insumos, presupuestos) viven en el localStorage del perfil
// del usuario (AppData), no en la carpeta de instalación, así que se conservan al actualizar.
// Para que eso siga siendo cierto, no cambiar "appId" ni "productName" en package.json.
function setupAutoUpdates(mainWindow) {
  if (isDev) return;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  let isPromptOpen = false;

  autoUpdater.on('update-available', async (info) => {
    if (isPromptOpen) return;
    isPromptOpen = true;
    const { response } = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Nueva versión disponible',
      message: `Hay una nueva versión de Tiker - Cotizador (${info.version}).`,
      detail: `Tenés instalada la versión ${app.getVersion()}. Tus productos, insumos y presupuestos se conservan al actualizar.\n\n¿Querés descargarla ahora?`,
      buttons: ['Descargar', 'Más tarde'],
      defaultId: 0,
      cancelId: 1
    });
    isPromptOpen = false;
    if (response === 0) {
      autoUpdater.downloadUpdate().catch(error => console.error('Error al descargar la actualización:', error));
    }
  });

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.setProgressBar(progress.percent / 100);
  });

  autoUpdater.on('update-downloaded', async (info) => {
    mainWindow.setProgressBar(-1);
    const { response } = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Actualización lista',
      message: `La versión ${info.version} ya está descargada.`,
      detail: 'Se instalará al reiniciar la aplicación. Si elegís "Más tarde", se instala sola la próxima vez que cierres la app.',
      buttons: ['Reiniciar ahora', 'Más tarde'],
      defaultId: 0,
      cancelId: 1
    });
    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.on('error', (error) => {
    // Sin internet o GitHub caído: no molestamos a la persona, se reintenta más tarde
    mainWindow.setProgressBar(-1);
    console.error('Error en la actualización automática:', error);
  });

  const checkForUpdates = () => {
    autoUpdater.checkForUpdates().catch(error => console.error('No se pudo buscar actualizaciones:', error));
  };

  checkForUpdates();
  setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL_MS);
}

function createWindow() {
  const iconPath = path.join(__dirname, '../public/favicon.ico');

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 980,
    minHeight: 650,
    title: 'Tiker — Cotizador & ABM',
    icon: iconPath,
    autoHideMenuBar: true,
    backgroundColor: '#f8fafc',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Make external links open in the system default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Buscar actualizaciones una vez que la ventana terminó de cargar
  mainWindow.webContents.once('did-finish-load', () => setupAutoUpdates(mainWindow));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
