const fs = require("node:fs");

(async () => {
	const { default: chalk } = await import("chalk");

	if (!fs.existsSync("./assets/")) fs.mkdirSync("./assets/");
	const chunkFiles = fs.readdirSync("./js/");
	console.log(`Found ${chalk.blue(chunkFiles.length)} files`);
	const startTime = Date.now();
	for (const file of chunkFiles) {
		try {
			console.log(`Reading ${chalk.blue(file)}`);
			const contents = fs.readFileSync(`./js/${file}`, "utf8");
			const assets = [...contents.matchAll(/"(?<name>\w*\.(?:png|jpg|jpeg|gif|webp|svg|mp4|webm|mp3|ico|mov))"/g)].map((e) => e.groups.name);
			console.log(`Found ${chalk.blue(assets.length)} assets`);
			for (const asset of assets) {
				try {
					console.log(`- Downloading ${chalk.blue(asset)}`);
					const content = await (await fetch(`https://discord.com/assets/${asset}`)).arrayBuffer();
					fs.writeFileSync(`./assets/${asset}`, Buffer.from(content));
				} catch {
					console.log(`Error downloading ${chalk.red(asset)}`);
				}
			}
		} catch {
			console.log(`Error reading ${chalk.red(file)}`);
		}
	}
	const downloaded = fs.readdirSync("./assets/");
	console.log(chalk.blue(`Downloaded ${downloaded.length} assets in ${Math.round((Date.now() - startTime) / 1000)}s`));
})();
