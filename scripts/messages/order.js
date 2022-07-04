const { promises: fs } = require("fs");
const path = require("path");

let locale = '';

process.stdin.on('readable', () => {
  const chunck = process.stdin.read();
  if (chunck !== null) {
    locale += chunck;
  }
});

process.stdin.on('end', () => {
  if (!locale) {
    console.log("ERROR: locale is required.");
    process.exit(0);
  }
  exec();
});

const exec = async () => {
  try {
    
    const filepath = path.join(__dirname, "..", "..", "i18n_translations", `${locale}.json`);
    
    const buffer = await fs.readFile(filepath, "utf8");
    const jsonData = JSON.parse(buffer);

    let ordened = {};
    
    Object.entries(jsonData)
    .sort(([a, _], [b, __]) => {
      if (a === b) return 0;
      return a > b? 1 : -1;
    })
    .map(([key, value]) => {
      Object.assign(ordened, { [`${key}`]: value });
      return null;
    });
    
    await fs.writeFile(filepath, JSON.stringify(ordened));

  } catch (e) {
    console.log("ERROR", e.message);
  }
}