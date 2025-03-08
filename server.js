require("dotenv").config();
__path = process.cwd();
const express = require("express");
const secure = require("ssl-express-www");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;
const API_DOMAIN = process.env.API_DOMAIN || `http://localhost:${PORT}`;

app.enable('trust proxy');
app.set('json spaces', 2);
app.use(cors());
app.use(secure);

const DOWNLOADS_FOLDER = "downloads";
const DATABASE_FILE = "database.json";

if (!fs.existsSync(DOWNLOADS_FOLDER)) {
	fs.mkdirSync(DOWNLOADS_FOLDER);
}

if (!fs.existsSync(DATABASE_FILE)) {
	fs.writeFileSync(DATABASE_FILE, JSON.stringify([], null, 2));
}

function getCurrentTime() {
	return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
}

function getUserIP(req) {
	return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
}

function logUsage(req, feature) {
	const ip = getUserIP(req);
	const time = getCurrentTime();
	const userAgent = req.headers["user-agent"] || "Unknown Platform";

	const logEntry = {
		time,
		ip,
		platform: userAgent,
		feature,
	};

	const logs = JSON.parse(fs.readFileSync(DATABASE_FILE, "utf8"));
	logs.push(logEntry);
	fs.writeFileSync(DATABASE_FILE, JSON.stringify(logs, null, 2));

	console.log(`\n[${time}] IP: ${ip} | Platform: ${userAgent} | Feature: ${feature}\n`);
}

function getYouTubeVideoId(url) {
	const regex =
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|embed\/|user\/[^\/\n\s]+\/)?(?:watch\?v=|v%3D|embed%2F|video%2F)?|youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtube\.com\/playlist\?list=)([a-zA-Z0-9_-]{11})/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

cron.schedule("0 * * * *", () => {
	console.log("Running scheduled cache cleanup...");
	fs.readdir(DOWNLOADS_FOLDER, (err, files) => {
		if (err) return console.error("Error reading downloads folder:", err);

		files.forEach((file) => {
			const filePath = path.join(DOWNLOADS_FOLDER, file);
			fs.unlink(filePath, (err) => {
				if (err) console.error("Error deleting file:", filePath, err);
				else console.log("Deleted file:", filePath);
			});
		});
	});
});

app.get("/", (req, res) => {
	logUsage(req, "Home");
	res.json({ status: true, message: "API is running successfully.", author: "@RaziekOfc" });
});

function downloadYouTube(req, url, format, res) {
	logUsage(req, format === "mp3" ? "ytmp3" : "ytmp4");

	const videoId = getYouTubeVideoId(url);
	if (!videoId) {
		return res.json({ 
			status: false, 
			message: "Invalid YouTube URL", 
			author: "@RaziekOfc" 
		});
	}

	const ext = format === "mp3" ? "mp3" : "mp4";
	const output = `${DOWNLOADS_FOLDER}/${videoId}.${ext}`;
	const quality = format === "mp3" ? "bestaudio" : `bestvideo[height<=${format}]+bestaudio/best`;

	const command = `yt-dlp -f "bestaudio" --extract-audio --audio-format mp3 -o "downloads/%(id)s.%(ext)s" "${url}"`;
	exec(command, (error) => {
		if (error) {
			console.error("Download error:", error);
			return res.json({ 
				status: false, 
				message: "Download failed", 
				author: "@RaziekOfc" 
			});
		}
		res.json({ 
			status: true, 
			message: "Download successful", 
			author: "@RaziekOfc", 
			download: `${API_DOMAIN}/downloads/${videoId}.${ext}` 
		});
	});
}

app.get("/ytmp3", (req, res) => {
	const { url } = req.query;
	downloadYouTube(req, url, "mp3", res);
});

app.get("/ytmp4", (req, res) => {
	const { url, format = 360 } = req.query;
	downloadYouTube(req, url, format, res);
});

app.get("/logs", (req, res) => {
	const logs = JSON.parse(fs.readFileSync(DATABASE_FILE, "utf8"));
	res.json({ 
		status: true, 
		logs 
	});
});

app.get("/clear-logs", (req, res) => {
	fs.writeFileSync(DATABASE_FILE, JSON.stringify([], null, 2));
	res.json({ 
		status: true, 
		message: "Logs cleared successfully." 
	});
});

app.use("/downloads", express.static(DOWNLOADS_FOLDER));

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
