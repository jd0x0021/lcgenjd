import classNames from "classnames";
import { MouseEvent } from "react";

type BtnColor =
	| "bg-green-501"
	| "bg-blue-501"
	| "bg-amber-501"
	| "bg-orange-501"
	| "bg-red-501"
	| "bg-stone-901";

type HoverColor =
	| "hover:bg-green-700"
	| "hover:bg-blue-700"
	| "hover:bg-amber-700"
	| "hover:bg-orange-700"
	| "hover:bg-red-700"
	| "hover:bg-stone-902";

type FocusRingColor =
	| "focus:ring-green-300"
	| "focus:ring-blue-300"
	| "focus:ring-amber-300"
	| "focus:ring-orange-300"
	| "focus:ring-red-300"
	| "focus:ring-stone-700";

type Color = {
	background: BtnColor;
	hover: HoverColor;
	focusRing: FocusRingColor;
};

type Button = {
	text: string;
	color: Color;
	width?: string;
	onClick?(e: MouseEvent<HTMLButtonElement>): any;
};

const Button = (button: Button) => {
	const buttonStyles = classNames(
		button.width,
		"rounded-md",
		"px-4 py-1.5",
		"focus:ring-1",
		"font-semibold",
		"text-sm text-gray-200",
		`${button.color.background}`,
		`${button.color.hover}`,
		`${button.color.focusRing}`
	);

	return (
		<button type="button" onClick={button.onClick} className={buttonStyles}>
			{button.text}
		</button>
	);
};

export default Button;
