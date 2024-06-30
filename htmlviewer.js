const fs = require("node:fs");
const { exit } = require("node:process");

const styleHtml = (html) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discord assets</title>
    <style>
        * {
            max-width: 10vw;
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
};

(async () => {
	const { default: chalk } = await import("chalk");

	if (!fs.existsSync("./assets/")) {
		console.log(chalk.red("Assets folder not found!"));
		exit(1);
	}

	const files = fs.readdirSync("./assets/");
	let html = "";
	console.log(chalk.blue("Generating index.html"));
	const startTime = Date.now();
	for (const file of files) {
		try {
			const type = file.split(".").pop();
			if (["png", "jpg", "jpeg", "gif", "webp", "svg", "ico"].includes(type)) {
				html += `<img src="assets/${file}">\n`;
			} else if (["mp4", "webm", "mov"].includes(type)) {
				html += `<video src="assets/${file}" controls></video>\n`;
			} else if (["mp3"].includes(type)) {
				html += `<audio src="assets/${file}" controls></audio>\n`;
			}
		} catch {}
	}
	fs.writeFileSync("index.html", styleHtml(html));
	console.log(chalk.blue(`Generated index.html in ${Math.round((Date.now() - startTime) / 1000)}s`));
})();
