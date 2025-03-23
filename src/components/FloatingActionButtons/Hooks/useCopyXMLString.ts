import { BiClipboard } from "react-icons/bi";
import IconButton, {
	IconButtonType,
	TOOLTIP_BODY_POSITION,
	TOOLTIP_POINTER_VARIANT,
} from "~/components/Common/Button/IconButton";
import { FloatingActionIconButtonType } from "~/components/FloatingActionButtons/FloatingActionButtons";
import { useChangeLogContext } from "~/contexts/ChangeLogContextProvider";
import XmlVisualizerPanel, { databaseChangeLogXmlStringBuilder } from "~/panels/XmlVisualizerPanel";

/**
 * Create an {@link IconButtonType} object that will represent the 'Copy XML' floating action
 * button component ({@link IconButton}) - which is responsible for copying the XML string
 * that is being rendered in {@link XmlVisualizerPanel} (the right panel of the page).
 *
 * @returns
 */
export const useCopyXMLString = (): FloatingActionIconButtonType => {
	const { changeLog } = useChangeLogContext();
	const rawXmlString: string = databaseChangeLogXmlStringBuilder(changeLog);

	return {
		iconType: BiClipboard,
		onClick: () => {
			// copy the xmlString to clipboard
			navigator.clipboard.writeText(rawXmlString);
		},
		tooltip: {
			idleText: "Copy XML",
			onClickText: "Copied!",
			bodyPosition: TOOLTIP_BODY_POSITION.LEFT,
			pointerLocation: TOOLTIP_POINTER_VARIANT.RIGHT,
		},
	};
};
