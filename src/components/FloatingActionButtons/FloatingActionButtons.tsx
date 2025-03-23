import IconButton, {
	ICON_BUTTON_VARIANT,
	IconButtonType,
	TOOLTIP_BODY_POSITION,
	TOOLTIP_POINTER_VARIANT,
} from "~/components/Common/Button/IconButton";

/**
 * Required is used to ensure that all floating action IconButtonTypes have a tooltip data.
 * Omit is used to the variant property so that all floating action buttons (a group of IconButtons)
 * will ALWAYS have the same variant.
 */
export type FloatingActionIconButtonType = Required<Omit<IconButtonType, "variant">>;

type FloatingActionButtonsProps = {
	iconButtons: FloatingActionIconButtonType[];
};

/**
 * This component renders ALL the floating action buttons that can be seen on the top right side of the screen.
 *
 * @param props
 * @returns
 */
const FloatingActionButtons = (props: FloatingActionButtonsProps) => {
	return (
		<div className="fixed right-5 top-5 z-10 flex flex-col gap-2">
			{props.iconButtons.map((iconButton, i) => (
				<IconButton
					key={i}
					iconType={iconButton.iconType}
					variant={ICON_BUTTON_VARIANT.ROUND}
					onClick={iconButton.onClick}
					tooltip={{
						idleText: iconButton.tooltip?.idleText,
						onClickText: iconButton.tooltip?.onClickText,
						bodyPosition: TOOLTIP_BODY_POSITION.LEFT,
						pointerLocation: TOOLTIP_POINTER_VARIANT.RIGHT,
					}}
				/>
			))}
		</div>
	);
};

export default FloatingActionButtons;
