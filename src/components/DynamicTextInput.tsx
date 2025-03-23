import classNames from "classnames";
import { ChangeEvent, FocusEventHandler, useRef } from "react";

type DynamicTextInputProps = {
	id: string;
	value: string;
	placeHolder?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
	onFocus: FocusEventHandler<HTMLInputElement>;
};

/**
 * This component is a dynamic {@link HTMLInputElement} that
 * automatically adjusts its width to match the input text width.
 *
 * @param props
 * @returns
 */
const DynamicTextInput = (props: DynamicTextInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const inputWidth = "w-[153px]";
	const inputClassNames = classNames(`${inputWidth} bg-transparent py-2 px-3 font-bold`);

	const updateInputWidthDynamically = () => {
		const inputElement: HTMLInputElement | null = inputRef.current;

		if (inputElement === null) {
			return;
		}

		// These constants are based on the current CSS applied
		const BASE_INPUT_WIDTH = 5;
		// smallest width when there are no characters in the input element
		const SMALLEST_TOTAL_ELEMENT_WIDTH = "29px";
		const DEFAULT_PLACE_HOLDER_MAX_WIDTH = inputWidth.replace(/[w\-\[\]]/g, "");

		inputElement.style.width = "0"; // needed to resize input on delete
		inputElement.style.width = inputElement.scrollWidth + BASE_INPUT_WIDTH + "px";
		inputElement.style.maxWidth = "300px";

		// to resize the input element back to its default width
		if (inputElement.style.width === SMALLEST_TOTAL_ELEMENT_WIDTH) {
			inputElement.style.width = DEFAULT_PLACE_HOLDER_MAX_WIDTH;
		}
	};

	return (
		<input
			type="text"
			ref={inputRef}
			value={props.value}
			placeholder={props.placeHolder}
			className={inputClassNames}
			onChange={(e) => {
				updateInputWidthDynamically();
				props.onChange(e, props.id);
			}}
			onFocus={props.onFocus}
		/>
	);
};

export default DynamicTextInput;
