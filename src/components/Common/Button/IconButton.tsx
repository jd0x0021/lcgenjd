import classNames from "classnames";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { IconType } from "react-icons";

export const ICON_BUTTON_VARIANT = {
	ROUND: "round",
	SQUARE: "square",
} as const;

export const TOOLTIP_BODY_POSITION = {
	LEFT: "left",
	BOTTOM: "bottom",
} as const;

export const TOOLTIP_POINTER_VARIANT = {
	RIGHT: "right",
	TOP: "top",
} as const;

export type IconButtonType = {
	iconType: IconType;
	variant: IconButtonVariant;
	onClick(e: MouseEvent<HTMLButtonElement>): any;
	tooltip?: IconButtonTooltipType;
};

type IconButtonTooltipType = {
	idleText: string;
	onClickText: string; // the button tooltip text that will get displayed when the button is clicked
	bodyPosition: TooltipBodyPositionVariant; // where the tooltip is located relative to the Icon Button
	pointerLocation: TooltipPointerVariant; // where the tooltip pointer is located relavite to the tooltip.bodyPosition
};

type IconButtonVariant = (typeof ICON_BUTTON_VARIANT)[keyof typeof ICON_BUTTON_VARIANT];

type TooltipBodyPositionVariant =
	(typeof TOOLTIP_BODY_POSITION)[keyof typeof TOOLTIP_BODY_POSITION];

type TooltipPointerVariant = (typeof TOOLTIP_POINTER_VARIANT)[keyof typeof TOOLTIP_POINTER_VARIANT];

/**
 * The styles for the {@link IconButton} component.
 *
 * @param variant
 * @returns
 */
const iconButtonStyles = (variant: IconButtonVariant): string => {
	// default IconButton shape is square (ICON_BUTTON_VARIANT.SQUARE)
	let iconButtonShape: string = "rounded-md";

	if (variant === ICON_BUTTON_VARIANT.ROUND) {
		iconButtonShape = "rounded-full"; // round IconButton shape
	}

	return classNames(
		"group relative cursor-pointer rounded-full p-2 duration-300",
		"bg-slate-600 text-gray-200 hover:bg-green-500",
		iconButtonShape
	);
};

/**
 * The general styles for the {@link IconButton} component's \<span/> tooltip.
 *
 * @param currentTooltipText
 * @param idleTooltipText
 * @returns
 */
const generalTooltipStyles = (
	currentTooltipText: string | undefined,
	idleTooltipText: string | undefined
): string => {
	// don't show the tooltip if there is no tooltip text
	// because tooltips are optional for IconButtonTypes
	if (currentTooltipText === undefined || idleTooltipText === undefined) {
		return "";
	}

	// the tooltip text changes when the button is clicked
	const buttonIsClicked: boolean = currentTooltipText !== idleTooltipText;

	return classNames(
		// general tooltip classes
		"hidden group-hover:block",

		// tooltip body styles
		`${buttonIsClicked ? "text-green-500" : ""}`,
		"bg-gray-600 text-center text-sm w-24 rounded-lg p-2"
	);
};

/**
 * The position of the actual tooltip body \<span/> relavite to the {@link IconButton} is styled here.
 *
 * @param iconButtonTooltipType
 * @returns
 */
const tooltipPosition = (iconButtonTooltipType: IconButtonTooltipType | undefined): string => {
	// no styles are applied if there is no tooltip
	if (iconButtonTooltipType === undefined) {
		return "";
	}

	switch (iconButtonTooltipType.bodyPosition) {
		case TOOLTIP_BODY_POSITION.LEFT:
			return "absolute right-[135%] top-[50%] -translate-y-1/2";
		case TOOLTIP_BODY_POSITION.BOTTOM:
			return "absolute right-[-76%] top-[142%]";
		default:
			const neverReachedTooltipBodyPositionVariant: never =
				iconButtonTooltipType.bodyPosition;
			throw new Error(
				`ERROR! A new TooltipBodyPositionVariant case was not handled by the exhaustive switch in
				${tooltipPosition.name} with unexpected value:
				${JSON.stringify(neverReachedTooltipBodyPositionVariant)}`
			);
	}
};

/**
 * The tooltip pointer's triangle style.
 *
 * @param iconButtonTooltipType
 * @returns
 */
const tooltipPointerStyles = (iconButtonTooltipType: IconButtonTooltipType | undefined): string => {
	// no styles are applied if there is no tooltip
	if (iconButtonTooltipType === undefined) {
		return "";
	}

	switch (iconButtonTooltipType.pointerLocation) {
		case TOOLTIP_POINTER_VARIANT.RIGHT:
			return classNames(
				// tooltip pointer shape
				"before:border-8 before:border-transparent before:border-l-gray-600",
				// tooltip pointer position
				"before:absolute before:left-[100%] before:top-1/2 before:-translate-y-1/2"
			);
		case TOOLTIP_POINTER_VARIANT.TOP:
			return classNames(
				// tooltip pointer shape
				"before:border-8 before:border-transparent before:border-b-gray-600",
				// tooltip pointer position
				"before:absolute before:left-[42%] before:-top-4"
			);
		default:
			const neverReachedTooltipPointerVariant: never = iconButtonTooltipType.pointerLocation;
			throw new Error(
				`ERROR! A new TooltipPointerVariant case was not handled by the exhaustive switch in
				${tooltipPointerStyles.name} with unexpected value:
				${JSON.stringify(neverReachedTooltipPointerVariant)}`
			);
	}
};

/**
 * The tooltip's default (idle) and onclick text is set and processed here.
 *
 * @param idleTooltipText
 * @returns
 */
const useToolTipText = (
	idleTooltipText: string | undefined
): [string | undefined, Dispatch<SetStateAction<string | undefined>>] => {
	const [tooltipText, setTooltipText] = useState<string | undefined>(idleTooltipText);

	// This useEffect will not trigger an infinite loop because the only possible values set to the
	// tooltipText (state variable) are the tooltip's idle text or the tooltip's onclick text (which
	// is just toggled back after 3 seconds when the state updates from onclick to idle text).
	useEffect(() => {
		// Create a new timer that resets the tooltip text back FROM the tooltip's onclick text TO
		// the tooltip's idle text. The tooltipText (state variable) will only get updated TO the
		// tooltip's onclick text once the button (rendered by the IconButton component) is clicked.
		// The tooltipText will go back TO the tooltip's idle text after 3 seconds.
		const timer = setTimeout(() => {
			// Once the tooltipText's value has been reset FROM the tooltip's onclick text TO the
			// tooltip's idle text the setter for the tooltipText inside this timer's code will no
			// longer trigger a rerender since tooltipText's (state variable) value is just the
			// same from the last render scope.
			setTooltipText(idleTooltipText);
		}, 3000);

		// Clear the timer (from the LAST render scope) after every rerender, so that we don't
		// have MULTIPLE timers running for the IconButton component.
		return () => clearTimeout(timer);
	}, [tooltipText]);

	return [tooltipText, setTooltipText];
};

const IconButton = (props: IconButtonType) => {
	const [tooltipText, setTooltipText] = useToolTipText(props.tooltip?.idleText);

	const bubblePointTooltipStyles = classNames(
		generalTooltipStyles(tooltipText, props.tooltip?.idleText),
		tooltipPosition(props.tooltip),
		tooltipPointerStyles(props.tooltip)
	);

	return (
		<button
			className={iconButtonStyles(props.variant)}
			onClick={(e) => {
				props.onClick(e);
				setTooltipText(props.tooltip?.onClickText);
			}}
		>
			<props.iconType size="1.4em" />
			<span className={bubblePointTooltipStyles}>{tooltipText}</span>
		</button>
	);
};

export default IconButton;
