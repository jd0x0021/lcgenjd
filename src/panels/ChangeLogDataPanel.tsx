import { nanoid } from "nanoid";
import { GrPowerReset } from "react-icons/gr";
import ChangeLogMetadata from "~/components/ChangeLogMetadata";
import ChangeSet, {
	ChangeSetType,
	DEFAULT_CHANGESET_ORDER,
	DEFAULT_DATABASE_TABLE_DML_VARIANT,
} from "~/components/ChangeSet";
import Button from "~/components/Common/Button/Button";
import IconButton, {
	ICON_BUTTON_VARIANT,
	TOOLTIP_BODY_POSITION,
	TOOLTIP_POINTER_VARIANT,
} from "~/components/Common/Button/IconButton";
import { getDefaultChangeLogData, useChangeLogContext } from "~/contexts/ChangeLogContextProvider";
import XmlVisualizerPanel from "~/panels/XmlVisualizerPanel";
import { useToggle } from "~/utils/toggleContent";

const changeLogMetaDataButtonText = (changeLogMetadataIsVisible: boolean): string => {
	return changeLogMetadataIsVisible ? "Hide Changelog Metadata" : "Show Changelog Metadata";
};

/**
 * This component renders all the input related components, and those user inputs will
 * then be converted from text to structured xml by {@link XmlVisualizerPanel} component.
 *
 * @returns
 */
const ChangeLogDataPanel = () => {
	const { changeLog, setChangeLog } = useChangeLogContext();
	const [contentIsVisible, setContentIsVisible] = useToggle(true);

	const addChangeSet = () => {
		const changeSet: ChangeSetType = {
			id: nanoid(),
			databaseTablesDMLVariant: DEFAULT_DATABASE_TABLE_DML_VARIANT,
			databaseTables: [],
		};

		const changeSetsWithNewRecord = [...changeLog.changeSets, changeSet];

		setChangeLog((prevState) => ({
			...prevState,
			changeSets: changeSetsWithNewRecord,
		}));
	};

	return (
		<div className="flex-col space-y-5 bg-gray-801 p-4">
			<div className="changelog-actions flex gap-3">
				<Button
					text="Add Changeset"
					color={{
						background: "bg-green-501",
						hover: "hover:bg-green-700",
						focusRing: "focus:ring-green-300",
					}}
					onClick={addChangeSet}
				/>

				<Button
					text={changeLogMetaDataButtonText(contentIsVisible)}
					color={{
						background: "bg-blue-501",
						hover: "hover:bg-blue-700",
						focusRing: "focus:ring-blue-300",
					}}
					onClick={setContentIsVisible}
				/>

				<div className="ml-auto">
					<IconButton
						iconType={GrPowerReset}
						variant={ICON_BUTTON_VARIANT.SQUARE}
						onClick={() => {
							setChangeLog(getDefaultChangeLogData());
						}}
						tooltip={{
							idleText: "Reset changelog data to default",
							onClickText: "Reset successful!",
							bodyPosition: TOOLTIP_BODY_POSITION.BOTTOM,
							pointerLocation: TOOLTIP_POINTER_VARIANT.TOP,
						}}
					/>
				</div>
			</div>

			{contentIsVisible ? <ChangeLogMetadata /> : null}

			<div className="changesets flex-col space-y-5">
				{changeLog.changeSets?.map((changeSet, index) => {
					const changeSetCount = changeLog.changeSets.length;

					return (
						<ChangeSet
							key={changeSet.id}
							currentChangeSetId={changeSet.id}
							order={changeSetCount === 1 ? DEFAULT_CHANGESET_ORDER : index}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default ChangeLogDataPanel;
