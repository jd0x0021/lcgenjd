import { WheelEvent } from "react";

export const enableVerticalScrolling = () => {
	window.onscroll = function () {};
};

export const horizontalMouseScroll = (e: WheelEvent<HTMLDivElement>) => {
	disableVerticalScrolling();
	const tableGroupHeader = document.querySelector(".database-table-tab-group .header");

	tableGroupHeader?.scrollTo({
		top: 0,
		left: tableGroupHeader?.scrollLeft + e.deltaY,
		behavior: "smooth",
	});
};

const disableVerticalScrolling = () => {
	const x = window.scrollX;
	const y = window.scrollY;

	window.onscroll = function () {
		window.scrollTo(x, y);
	};
};
