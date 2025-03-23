import classNames from "classnames";
import { nanoid } from "nanoid";
import { ChangeEvent } from "react";
import { BiChevronDown, BiTrash } from "react-icons/bi";
import { AUDIT_FIELD_VARIANT } from "~/components/AuditField";
import Button from "~/components/Common/Button/Button";
import { DatabaseTableType } from "~/components/DatabaseTable/DatabaseTableContent";
import DatabaseTableTabGroup from "~/components/DatabaseTable/DatabaseTableTabGroup";
import { ChangeLogType, useChangeLogContext } from "~/contexts/ChangeLogContextProvider";
import XmlVisualizerPanel from "~/panels/XmlVisualizerPanel";
import { DMLType, DMLVariant } from "~/types/DML";
import { defaultDisplayTableValues } from "~/utils/tableUtils";
import { useToggle } from "~/utils/toggleContent";

export const DEFAULT_CHANGESET_ORDER = -1;
export const DEFAULT_DATABASE_TABLE_DML_VARIANT: DMLVariant = DMLVariant.INSERT_DML;

type ChangeSetProps = {
	currentChangeSetId: string;
	// order is assigned -1 if there is only one ChangeSet record from a ChangeLog
	// or when adding a new ChangeSet record in an array of ChangeSets
	order: number;
};

export type ChangeSetType = {
	id: string;
	comment?: string;
	databaseTablesDMLVariant: DMLVariant;
	databaseTables: DatabaseTableType[];
};

/**
 * Append a letter to a {@link ChangeSet} component's title if there are more than 1
 * {@link ChangeSetType}s that belong to a {@link ChangeLogType}. If there is only 1
 * {@link ChangeSetType}, do not append a letter.
 *
 * The letter will start from 'A'.
 *
 * @param changeSetOrder the order of the changeSet in the list of changeSets
 * @returns
 */
export const determineChangeSetLabel = (changeSetOrder: number): string => {
	if (changeSetOrder === DEFAULT_CHANGESET_ORDER) return ""; // NO LABEL
	const assignLetter = String.fromCharCode(97 + changeSetOrder); // String.fromCharCode(97) = letter 'a'
	return assignLetter.toUpperCase(); // Will have a letter as a label
};

const determineLogicalFilePath = (logicalFilePath: string): string => {
	const trimmedLogicalFilePath: string = logicalFilePath.trim();
	return trimmedLogicalFilePath === "" ? "LOGICAL_FILE_PATH" : trimmedLogicalFilePath;
};

/**
 * Returns a DMLType with default values based on a certain DMLVariant.
 * Each DMLVariant will have different properties.
 *
 * @param databaseTablesDMLVariant
 * @returns
 */
const getDefaultDMLValues = (databaseTablesDMLVariant: DMLVariant): DMLType => {
	switch (databaseTablesDMLVariant) {
		case DMLVariant.INSERT_DML:
			return {
				id: nanoid(),
				dmlVariant: DMLVariant.INSERT_DML,
				auditFieldVariant: AUDIT_FIELD_VARIANT.UNDERSCORE,
				valuesToInsert: defaultDisplayTableValues(),
			};
		case DMLVariant.UPDATE_DML:
			return {
				id: nanoid(),
				dmlVariant: DMLVariant.UPDATE_DML,
				valuesToUpdate: defaultDisplayTableValues(),
				oldValuesToRollback: defaultDisplayTableValues(),
				whereClause: defaultDisplayTableValues(),
				auditFieldVariant: AUDIT_FIELD_VARIANT.UNDERSCORE,
			};
		case DMLVariant.DELETE_DML:
			return {
				id: nanoid(),
				dmlVariant: DMLVariant.DELETE_DML,
				whereClause: defaultDisplayTableValues(),
				oldValuesToInsert: defaultDisplayTableValues(),
				auditFieldVariant: AUDIT_FIELD_VARIANT.UNDERSCORE,
			};
		default:
			const neverReachedDMLVariant: never = databaseTablesDMLVariant;
			throw new Error(
				`ERROR! A new DMLVariant case was not handled by the exhaustive switch in
         		${getDefaultDMLValues.name} with unexpected value:
         		${JSON.stringify(neverReachedDMLVariant)}`
			);
	}
};

/**
 * This component renders and sets the data that will be used in a <changeSet> xml. The data that is
 * set in this coponent will be transformed to a stuctured xml in {@link XmlVisualizerPanel} component.
 *
 * @param props
 * @returns
 */
const ChangeSet = (props: ChangeSetProps) => {
	const { changeLog, setChangeLog } = useChangeLogContext();
	const [contentIsVisible, setContentIsVisible] = useToggle(true);

	const currentChangeSet = changeLog.changeSets.find((c) => c.id === props.currentChangeSetId);

	const changeSetContentStyles = classNames(
		`${
			currentChangeSet?.databaseTables &&
			currentChangeSet?.databaseTables?.length > 0 &&
			"space-y-5"
		}`,
		`${contentIsVisible ? "" : "hidden"}`
	);

	const changeSetLetterLabel = determineChangeSetLabel(props.order);
	const logicalFilePath = determineLogicalFilePath(changeLog.metaData.logicalFilePath);
	const changeSetId = `${logicalFilePath}${changeSetLetterLabel}`;

	const removeChangeSet = (changeSetId: string | undefined) => {
		const filteredChangeSets = changeLog.changeSets.filter(
			(changeSet) => changeSet.id != changeSetId
		);

		setChangeLog((prevState) => ({
			...prevState,
			changeSets: filteredChangeSets,
		}));
	};

	const updateChangeSetComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const newChangeSets = changeLog.changeSets.map((changeSet) => {
			// update the current changeSet's comment based on user input
			if (changeSet.id === currentChangeSet?.id) {
				changeSet.comment = e.target.value;
			}

			return changeSet;
		});

		setChangeLog((prevState: ChangeLogType) => ({
			...prevState,
			changeSets: newChangeSets,
		}));
	};

	const addDatabaseTable = () => {
		const newChangeSets = changeLog.changeSets.map((changeSet) => {
			if (changeSet.id !== currentChangeSet?.id) {
				return changeSet; // do nothing
			}

			const databaseTable: DatabaseTableType = {
				id: nanoid(),
				name: "",
				dml: getDefaultDMLValues(changeSet.databaseTablesDMLVariant),
			};

			changeSet.databaseTables = [...changeSet.databaseTables, databaseTable];

			return changeSet;
		});

		setChangeLog((prevState: ChangeLogType) => ({
			...prevState,
			changeSets: newChangeSets,
		}));
	};

	return (
		<div className="changeset flex flex-col space-y-5 rounded-md bg-gray-501 p-4">
			<div className="changeset-header flex justify-between">
				<div className="changeset-title flex w-11/12  items-center">
					<BiChevronDown
						color="#2BA143"
						size="1.8em"
						onClick={setContentIsVisible}
						className="cursor-pointer"
					/>
					<b>{changeSetId}</b>&nbsp; ChangeSet
				</div>

				{/* Delete Button */}
				<BiTrash
					color="#E93E30"
					size="2em"
					className="cursor-pointer p-1"
					onClick={() => removeChangeSet(currentChangeSet?.id)}
				/>
			</div>

			{
				<div className={changeSetContentStyles}>
					<div className="flex items-start gap-3">
						<Button
							text={"Add Table"}
							color={{
								background: "bg-blue-501",
								hover: "hover:bg-blue-700",
								focusRing: "focus:ring-blue-300",
							}}
							onClick={addDatabaseTable}
						/>

						<textarea
							id={`${props.currentChangeSetId}-comment`}
							placeholder="Comment"
							onChange={updateChangeSetComment}
							value={currentChangeSet?.comment}
							className="min-h-[3.5rem] w-full rounded-md bg-gray-601 px-3 py-2 text-sm"
						/>
					</div>

					{currentChangeSet && currentChangeSet.databaseTables.length > 0 && (
						<DatabaseTableTabGroup currentChangeSet={currentChangeSet} />
					)}
				</div>
			}
		</div>
	);
};

export default ChangeSet;
