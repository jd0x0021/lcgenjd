import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Split from "react-split";
import IconButton, {
	IconButtonType,
	TOOLTIP_BODY_POSITION,
	TOOLTIP_POINTER_VARIANT,
} from "~/components/Common/Button/IconButton";
import { FloatingActionIconButtonType } from "~/components/FloatingActionButtons/FloatingActionButtons";
import {
	DEFAULT_PANEL_SIZES,
	MAX_LEFT_PANEL_WIDTH,
	PANEL_EXPANDER_ICONS,
	panelWidthsHasBeenReset,
} from "~/components/FloatingActionButtons/Hooks/utils/panelExpanderUtils";

/**
 * Create an {@link IconButtonType} object that will represent the **'Left Panel Expander'** floating
 * action button component ({@link IconButton}) - which is responsible for expanding the left panel
 * to max width, and resetting it back to normal.
 *
 * @param setPanelSizes The setter function that will set the widths of the 2 **panels** of the page.
 * 		A **panel** is a \<{@link Split}/> component's child component (used in App.tsx).
 * @returns object type: {@link IconButtonType}
 */
export const useLeftPanelExpander = (
	panelSizes: [number, number],
	setPanelSizes: Dispatch<SetStateAction<[number, number]>>
): FloatingActionIconButtonType => {
	const [leftPanelIsExpanded, setLeftPanelIsExpanded] = useState<boolean>(false);

	useEffect(() => {
		if (panelWidthsHasBeenReset(panelSizes)) {
			setLeftPanelIsExpanded(false); // reset to default state
		}
	}, [panelSizes]);

	const expandLeftPanelIconButton: FloatingActionIconButtonType = {
		iconType: leftPanelIsExpanded
			? PANEL_EXPANDER_ICONS.RESET
			: PANEL_EXPANDER_ICONS.EXPAND_LEFT,
		onClick: () => {
			setLeftPanelIsExpanded((state) => !state);

			// If the left panel is already expanded: reset panels' sizes to default. Else expand left panel to its max
			// width (which reduces the right panel's width to its min width) to have a better view of the expanded panel.
			setPanelSizes(leftPanelIsExpanded ? DEFAULT_PANEL_SIZES : MAX_LEFT_PANEL_WIDTH);
		},
		tooltip: {
			idleText: leftPanelIsExpanded
				? "Reset Panel Widths To Default"
				: "Expand Left Panel's Width To Max",
			onClickText: leftPanelIsExpanded ? "Panels Reset!" : "Expanded!",
			bodyPosition: TOOLTIP_BODY_POSITION.LEFT,
			pointerLocation: TOOLTIP_POINTER_VARIANT.RIGHT,
		},
	};

	return expandLeftPanelIconButton;
};
