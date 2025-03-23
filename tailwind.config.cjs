/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				gray: {
					901: "#19191A",
					801: "#1E1F23",
					701: "#222327",
					601: "#212226",
					501: "#2E313C",
					401: "#2E3339",
				},
				green: {
					501: "#2BA143",
				},
				blue: {
					501: "#3794FF",
				},
				amber: {
					501: "#FF8E00",
				},
				orange: {
					501: "#F26623",
				},
				red: {
					501: "#E93E30",
				},
				stone: {
					901: "#686746",
					902: "#4D4C32",
				},
			},
		},
	},
	plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
