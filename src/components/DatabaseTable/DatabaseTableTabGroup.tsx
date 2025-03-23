import { useState } from "react";
import { ChangeSetType } from "~/components/ChangeSet";
import DatabaseTableContent from "~/components/DatabaseTable/DatabaseTableContent";
import DatabaseTableHeader from "~/components/DatabaseTable/DatabaseTableHeader";
import { enableVerticalScrolling, horizontalMouseScroll } from "~/utils/horizontalScrolling";

export type DatabaseTableTabGroupProps = {
	currentChangeSet: ChangeSetType;
};

/**
 * This component holds a group of {@link DatabaseTableHeader}s with their respective {@link DatabaseTableContent}
 * (which will be rendered in a _tab view_). A {@link DatabaseTableHeader} is a specific database table, while a
 * {@link DatabaseTableContent} holds the data that we want to insert/update/delete in that specific database table.
 *
 * @param props
 * @returns
 */
const DatabaseTableTabGroup = (props: DatabaseTableTabGroupProps) => {
	const [currentDatabaseTableId, setCurrentDatabaseTableId] = useState("");

	/**
	 * Show a {@link DatabaseTableContent} in the tab view display when true.
	 *
	 * @param id
	 * @returns
	 */
	const showDatabaseTableContent = (id: string): boolean => {
		const noHeaderHasBeenSelected = currentDatabaseTableId === "";

		if (noHeaderHasBeenSelected) {
			// set to the first record so that it can be visually selected in the UI
			setCurrentDatabaseTableId(props?.currentChangeSet?.databaseTables[0].id);
		}

		return currentDatabaseTableId === id;
	};

	return (
		<div className="database-table-tab-group relative overflow-hidden rounded-md border-2 border-gray-601">
			<div
				className="header overflow-x-scroll whitespace-nowrap scrollbar-thin scrollbar-track-gray-601 scrollbar-thumb-stone-700 scrollbar-thumb-rounded-md"
				onWheel={horizontalMouseScroll}
				onMouseLeave={enableVerticalScrolling}
			>
				{props?.currentChangeSet?.databaseTables.map((databaseTable) => (
					<DatabaseTableHeader
						key={databaseTable.id}
						currentDatabaseTable={databaseTable}
						parentChangeSetId={props.currentChangeSet.id}
						isSelected={currentDatabaseTableId == databaseTable.id}
						setDatabaseTableContentVisibility={setCurrentDatabaseTableId}
					/>
				))}
			</div>

			<div className="db-table-tab-group-content bg-gray-601">
				<div className="db-table-content-wrapper p-4">
					{props?.currentChangeSet?.databaseTables.map((databaseTable) => {
						return (
							<DatabaseTableContent
								key={databaseTable.id}
								isVisible={showDatabaseTableContent(databaseTable.id)}
								currentDML={databaseTable.dml}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default DatabaseTableTabGroup;
