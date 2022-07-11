const { promises: fs } = require("fs");
const path = require("path");


const [ _, __, key, locale, message ] = process.argv;

if ((!key || !key.startsWith("Error") && !key.startsWith("Success") && !key.startsWith("Mail") && !key.startsWith("Domain")) || !locale || !message) {
  console.log("ERROR: mal formatted");
  process.exit(0);
}

const filepath = path.join(__dirname, "..", "..", "i18n_translations", `${locale}.json`);

const exec = async () => {
  try {

    const buffer = await fs.readFile(filepath, "utf8")
    const jsonData = JSON.parse(buffer);

    if (jsonData[key]) {
      console.log("WARNING: key already exists");
      return;
    }

    Object.assign(jsonData, { [`${key}`]: message });
    fs.writeFile(filepath, JSON.stringify(jsonData));

    process.stdout.write(locale);

  } catch (e) {
    console.log("ERROR", e.message);
  }
}

exec();
