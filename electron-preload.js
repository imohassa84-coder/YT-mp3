// Minimal shim that defines global.File so modules expecting the browser File API don't throw
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
