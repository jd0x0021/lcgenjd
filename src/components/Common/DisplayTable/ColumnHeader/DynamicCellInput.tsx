import { ChangeEvent, KeyboardEvent, useEffect, useRef } from "react";
import ColumnHeaderCell from "~/components/Common/DisplayTable/ColumnHeader/ColumnHeaderCell";
import DisplayTable from "~/components/Common/DisplayTable/DisplayTable";

const ONE_CHARACTER_WIDTH = 5;
const MIN_PLACE_HOLDER_WIDTH = "62px";

/**
 * The tailwind css style "border-r-2" adds exactly 1.111px to the
 * table cell (seen on browser dev tools).
 */
const TABLE_CELL_BORDER_RIGHT_WIDTH = 1;

type DynamicCellInputProps = {
	id: string;
	text: string;
	placeHolder: string;
	onChange: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
};

/**
 * This component acts as an {@link HTMLInputElement} that is used as an editable cell for
 * all the column header cells ({@link ColumnHeaderCell}) in a {@link DisplayTable} component.
 *
 * @param props
 * @returns
 */
const DynamicCellInput = (props: DynamicCellInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const inputWrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (inputRef.current === null || inputWrapperRef.current === null) {
			return;
		}

		inputRef.current.style.minWidth = MIN_PLACE_HOLDER_WIDTH;

		const inputElementObserver = new ResizeObserver(() => {
			if (inputRef.current === null || inputWrapperRef.current === null) {
				return;
			}

			// if the input element's wrapper div width is greater than the input element's
			// width, set the input element's width back to '100%' so that the input element
			// will always fill the parent display table cell
			if (
				inputWrapperRef.current.getBoundingClientRect().width >
				inputRef.current.getBoundingClientRect().width
			) {
				inputRef.current.style.width = "100%";
			}

			updateWidthDynamically(0);
		});

		inputElementObserver.observe(inputRef.current);
		inputElementObserver.observe(inputWrapperRef.current);
	}, []);

	const resizeInputElement = (): void => {
		if (inputRef.current === null) {
			return;
		}

		// needed to resize the input element when deleting character/s
		inputRef.current.style.width = "0";

		// to ensure that the input element always fills the
		// remaining space in a table cell (to avoid shrinking
		// the input element when there is no text in it)
		inputRef.current.style.width = "100%";
	};

	/**
	 * The purpose of this function is to dynamically expand the input element's
	 * width so that we can always see **ALL** of the text that we give the
	 * input element.
	 *
	 * @param characterWidth refers to a text's width given to the input element
	 * @returns
	 */
	const updateWidthDynamically = (characterWidth: number): void => {
		if (inputRef.current === null) {
			return;
		}

		const inputWidthPlusBorderRightWidth: number =
			inputRef.current.clientWidth + TABLE_CELL_BORDER_RIGHT_WIDTH;
		const totalInputValueWidth: number = inputRef.current.scrollWidth;

		// if input's text is greater than the input element's width, expand input element
		// so that we can see all of the text input that is in the input element
		if (totalInputValueWidth > inputWidthPlusBorderRightWidth) {
			inputRef.current.style.width = inputRef.current.scrollWidth + characterWidth + "px";
		}
	};

	/**
	 * The purpose of this function is to resize the input element's width back down when we
	 * **delete** character/s from the input element using backspace or delete key. The smallest
	 * width our input element will get is going to be the same as the smallest cell
	 * in a {@link DisplayTable} component.
	 *
	 * @param e
	 * @returns
	 */
	const resizeOnDelete = (e: KeyboardEvent<HTMLInputElement>): void => {
		if (inputRef.current === null) {
			return;
		}

		const widthHasNoStyle = inputRef.current.style.width !== "";
		const widthIs100Percent = inputRef.current.style.width === "100%";
		const widthIs0px = inputRef.current.style.width === "0px";

		if (
			(e.key === "Backspace" || e.key === "Delete") &&
			(widthHasNoStyle || widthIs100Percent || widthIs0px)
		) {
			resizeInputElement();
		}
	};

	return (
		<div ref={inputWrapperRef} className="input-wrapper w-full">
			<input
				type="text"
				ref={inputRef}
				value={props.text}
				placeholder={props.placeHolder}
				className="w-full bg-transparent px-3 py-2 font-bold"
				onKeyDown={resizeOnDelete}
				onCut={() => resizeInputElement()}
				onChange={(e) => {
					updateWidthDynamically(ONE_CHARACTER_WIDTH);
					props.onChange(e, props.id);
				}}
			/>
		</div>
	);
};

export default DynamicCellInput;
