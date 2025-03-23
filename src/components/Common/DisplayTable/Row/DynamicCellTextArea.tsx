import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef } from "react";
import DisplayTable from "~/components/Common/DisplayTable/DisplayTable";
import TableRow, { TableRowCellType } from "~/components/Common/DisplayTable/Row/TableRow";

export const DEFAULT_TEXT_AREA_HEIGHT = "100%";

type DynamicCellTextAreaProps = {
	currentRowCell: TableRowCellType;
	height: string;
	setHeight: Dispatch<SetStateAction<string>>;
	onChange: (e: ChangeEvent<HTMLTextAreaElement>, id: string) => void;
};

/**
 * This component acts as an {@link HTMLTextAreaElement} that is used as an editable cell
 * for all the row cells ({@link TableRow}) in a {@link DisplayTable} component.
 *
 * @param props
 * @returns
 */
const DynamicCellTextArea = (props: DynamicCellTextAreaProps) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		const mutationObserver = new MutationObserver(() => {
			if (textareaRef.current === null) {
				return;
			}

			const currentTextAreaHeight: number = Number(
				textareaRef.current.style.height.replace(/[^\d.-]/g, "")
			);

			const sharedTextAreaStateHeight: number = Number(props.height.replace(/[^\d.-]/g, ""));

			// only set the 'shared height state' when the text area's height (style attribute)
			// is decreasing on resize, because when the text area's height (style attribute)
			// increases all of the textareas will automatically expand anyway
			if (currentTextAreaHeight <= sharedTextAreaStateHeight) {
				// set the shared height here so that DynamicCellTextArea components (on the same row)
				// can have a shared height style (on state)
				props.setHeight(textareaRef.current?.style.height as string);
			}
		});

		if (textareaRef.current !== null) {
			// to avoid having a small textarea for this component
			if (props.height === DEFAULT_TEXT_AREA_HEIGHT) {
				props.setHeight(textareaRef?.current?.getBoundingClientRect().height + "px");
			}

			textareaRef.current.style.height = props.height;

			mutationObserver.observe(textareaRef?.current, {
				attributes: true,
				attributeFilter: ["style"],
			});
		}
	}, [props]);

	/**
	 * This will set the initial shared height value for all of the
	 * {@link DynamicCellTextArea} components when onMouseUp triggers
	 * for a 'textarea' component.
	 */
	const initialTextAreaStateValue = () => {
		props.setHeight(textareaRef.current?.style.height as string);
	};

	return (
		<div className="flex h-full w-full">
			<textarea
				ref={textareaRef}
				rows={1}
				placeholder="NULL"
				value={props.currentRowCell.text}
				className="min-h-full w-full min-w-full resize bg-transparent px-3 py-2 font-medium tracking-wide"
				onMouseUp={initialTextAreaStateValue}
				onChange={(e) => {
					props.onChange(e, props.currentRowCell.id);
				}}
			/>
		</div>
	);
};

export default DynamicCellTextArea;
