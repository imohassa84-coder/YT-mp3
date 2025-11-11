// Provide a minimal global File shim for environments (Electron main) where
// `File` is not defined but some libraries (undici WebIDL) expect it.
if (typeof File === "undefined") {
  global.File = class File {
    constructor(parts = [], name = "file", options = {}) {
      this.parts = parts;
      this.name = name;
      this.lastModified = options.lastModified || Date.now();
      this.size = parts.reduce(
        (s, p) =>
          s + (typeof p === "string" ? Buffer.byteLength(p) : p.length || 0),
        0
      );
      this.type = options.type || "";
    }
    slice() {
      return new File(this.parts, this.name, {
        lastModified: this.lastModified,
        type: this.type,
      });
    }
  };
}

const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let serverProcess = null;
function startServer() {
  // Start server.js with node
  serverProcess = spawn(process.execPath, [path.join(__dirname, "server.js")], {
    env: process.env,
    stdio: "inherit",
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 700,
    frame: false,
    transparent: true,
    show: false, // create hidden, show after ready to ensure always-on-top takes effect
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.setAlwaysOnTop(true, "screen-saver");
  // make visible on all workspaces (helps on macOS/Windows multiple desktop setups)
  if (typeof win.setVisibleOnAllWorkspaces === "function") {
    win.setVisibleOnAllWorkspaces(true);
  }

  // Load the UI and then show & focus the window
  win.loadURL("http://localhost:3000/index.html");
  win.once("ready-to-show", () => {
    try {
      win.show();
      win.focus();
      win.setAlwaysOnTop(true, "screen-saver");
    } catch (e) {
      /* ignore show errors */
    }
  });
  // Allow dragging via CSS - set background to transparent and ensure draggable region in CSS
}

app.whenReady().then(() => {
  startServer();
  // give the server a short moment to start
  setTimeout(createWindow, 800);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== "darwin") app.quit();
});
