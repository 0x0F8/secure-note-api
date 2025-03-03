const { createHash } = require("node:crypto");

export function sha256(input: string) {
  return new Promise<string>((resolve, reject) => {
    const hash = createHash("sha256");

    hash.on("readable", () => {
      const data = hash.read();
      if (data) {
        resolve(data.toString("hex"));
      } else {
        reject("Unreadable");
      }
    });
    hash.on("error", (error: Error) => reject);
    hash.write(input);
    hash.end();
  });
}
