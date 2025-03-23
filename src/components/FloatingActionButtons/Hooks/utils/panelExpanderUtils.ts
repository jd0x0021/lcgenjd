import { LuPanelLeftClose, LuPanelRightClose, LuSplitSquareHorizontal } from "react-icons/lu";

export const DEFAULT_PANEL_SIZES: [number, number] = [50, 50];
export const MAX_LEFT_PANEL_WIDTH: [number, number] = [90, 10];
export const MAX_RIGHT_PANEL_WIDTH: [number, number] = [10, 90];

/**
 * The icons used for **panel expander icon buttons**.
 */
export const PANEL_EXPANDER_ICONS = {
	EXPAND_LEFT: LuPanelRightClose,
	EXPAND_RIGHT: LuPanelLeftClose,
	RESET: LuSplitSquareHorizontal,
} as const;

/**
 * To determine if the 2 panels' (of the page) width has been reset, we'll just need to check if the current
 * panels' size is equal to -> {@link DEFAULT_PANEL_SIZES}. If the panels' width is not equal to {@link DEFAULT_PANEL_SIZES},
 * that just means that either of the panels has been expanded.
 *
 * A panel has been expanded if its width is greater than the other panel.
 *
 * Both of the panels have been reset to default if they both have the same width.
 *
 * @param currentPanelSizes the current width sizes for the 2 panels of the page (stored in state from App.tsx)
 * @returns
 */
export const panelWidthsHasBeenReset = (currentPanelSizes: [number, number]): boolean => {
	return currentPanelSizes === DEFAULT_PANEL_SIZES;
};
