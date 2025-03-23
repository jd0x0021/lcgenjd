import { Dispatch, SetStateAction } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ChangeSetType } from "~/components/ChangeSet";
import { DisplayTableType } from "~/components/Common/DisplayTable/DisplayTable";
import { DatabaseTableType } from "~/components/DatabaseTable/DatabaseTableContent";
import FloatingActionButtons, {
	FloatingActionIconButtonType,
} from "~/components/FloatingActionButtons/FloatingActionButtons";
import { useCopyXMLString } from "~/components/FloatingActionButtons/Hooks/useCopyXMLString";
import { useLeftPanelExpander } from "~/components/FloatingActionButtons/Hooks/useLeftPanelExpander";
import { useRightPanelExpander } from "~/components/FloatingActionButtons/Hooks/useRightPanelExpander";
import { ChangeLogType, useChangeLogContext } from "~/contexts/ChangeLogContextProvider";
import ChangeLogDataPanel from "~/panels/ChangeLogDataPanel";
import { DMLType, DMLVariant } from "~/types/DML";
import { newLine, tab } from "~/utils/characterUtils";
import { displayTableHasRows } from "~/utils/tableUtils";
import { changeSetXmlStringBuilder } from "~/utils/xmlGeneration/changeSetXmlGeneration";
import {
	insertDmlRollbackStringBuilder,
	insertDmlXmlStringBuilder,
} from "~/utils/xmlGeneration/dml/insertDml/insertDmlXmlGeneration";

type XmlVisualizerSectionProps = {
	panelSizes: [number, number];
	setPanelSizes: Dispatch<SetStateAction<[number, number]>>;
};

/**
 * An XML String builder for the \<databaseChangeLog\> {@link ChangeLogType} tag.
 *
 * @param changeLog
 * @returns
 */
export const databaseChangeLogXmlStringBuilder = (changeLog: ChangeLogType): string => {
	// most of the attributes in the <databaseChangeLog> tag is found in the XML
	// example section here: https://docs.liquibase.com/concepts/changelogs/home.html
	const openingTag = [
		"<databaseChangeLog",
		`${tab(1)}xmlns="http://www.liquibase.org/xml/ns/dbchangelog"`,
		`${tab(1)}xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`,
		`${tab(1)}xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext"`,
		`${tab(1)}xmlns:pro="http://www.liquibase.org/xml/ns/pro"`,
		`${tab(1)}xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog`,
		`${tab(2)}http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd`,
		`${tab(2)}http://www.liquibase.org/xml/ns/dbchangelog-ext`,
		`${tab(2)}http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd`,
		`${tab(2)}http://www.liquibase.org/xml/ns/pro`,
		`${tab(2)}http://www.liquibase.org/xml/ns/pro/liquibase-pro-latest.xsd"`,
		`${tab(1)}logicalFilePath="${changeLog.metaData.logicalFilePath.trim()}">`,
	].join(newLine(1));
	const body = `${changeSetXmlStringBuilder(changeLog)}`;
	const closingTag = `</databaseChangeLog>`;

	return [openingTag, body, closingTag].join(newLine(1));
};

/**
 * This function converts {@link DMLType} data to their xml string representations based on their
 * {@link DMLVariant}. This function also proceses all of the{@link DatabaseTableType}s that
 * belong to a **single {@link ChangeSetType}**. If the `databaseTable.dml.DisplayTableType`
 * _(any {@link DisplayTableType} that belongs to a dml)_ does not have any row, there will be
 * no xml string generated for that {@link DMLType}.
 *
 * --> _(This is the function that will generate the actual **dml values**.)_
 *
 * @param databaseTables
 * @returns
 */
export const dmlToXmlStringBuilder = (
	databaseTables: DatabaseTableType[],
	changeSetId: string
): string => {
	const dmlBlocks: string[] = [];

	databaseTables.forEach((databaseTable) => {
		const databaseTablesDMLVariant = databaseTable.dml.dmlVariant;

		// process xml string based on their dmlVariant
		switch (databaseTablesDMLVariant) {
			case DMLVariant.INSERT_DML:
				if (displayTableHasRows(databaseTable.dml.valuesToInsert)) {
					// display this dml's xml string representation
					dmlBlocks.push(
						insertDmlXmlStringBuilder(
							databaseTable.dml,
							databaseTable.name,
							changeSetId
						)
					);
				}
				break;
			case DMLVariant.UPDATE_DML:
				return "";
			case DMLVariant.DELETE_DML:
				return "";
			default:
				const neverReachedDMLVariant: never = databaseTablesDMLVariant;
				throw new Error(
					`ERROR! A new DMLVariant case was not handled by the exhaustive switch in
					${dmlToXmlStringBuilder.name} with unexpected value:
		 			${JSON.stringify(neverReachedDMLVariant)}`
				);
		}
	});

	return dmlBlocks.join(newLine(2));
};

/**
 * This function creates the rollback xml string of a \<changeSet\>
 * ({@link ChangeSetType}) based on their {@link DMLVariant}.
 *
 * @param databaseTablesDMLVariant
 * @param databaseTables
 * @param changeSetId
 * @returns
 */
export const rollbackXmlStringBuilder = (
	databaseTablesDMLVariant: DMLVariant,
	databaseTables: DatabaseTableType[],
	changeSetId: string
): string => {
	switch (databaseTablesDMLVariant) {
		case DMLVariant.INSERT_DML:
			return insertDmlRollbackStringBuilder(databaseTables, changeSetId);
		case DMLVariant.UPDATE_DML:
			return "";
		case DMLVariant.DELETE_DML:
			return "";
		default:
			const neverReachedDMLVariant: never = databaseTablesDMLVariant;
			throw new Error(
				`ERROR! A new DMLVariant case was not handled by the exhaustive switch in
				${rollbackXmlStringBuilder.name} with unexpected value:
				${JSON.stringify(neverReachedDMLVariant)}`
			);
	}
};

/**
 * This component is the one responsible for rendering structured xml text. The data used
 * to render the structured xml is collected from {@link ChangeLogDataPanel} component.
 *
 * @param props
 * @returns
 */
const XmlVisualizerPanel = (props: XmlVisualizerSectionProps) => {
	const { changeLog } = useChangeLogContext();

	const rawXmlString: string = databaseChangeLogXmlStringBuilder(changeLog);

	// The IconButtons are declared here (instead of declaring it on the App.tsx) so that
	// I'll be able to use the ChangeLogContext for the useCopyXMLString() hook.
	const iconButtons: FloatingActionIconButtonType[] = [
		useCopyXMLString(),
		useLeftPanelExpander(props.panelSizes, props.setPanelSizes),
		useRightPanelExpander(props.panelSizes, props.setPanelSizes),
	];

	return (
		<div className="relative w-full">
			<FloatingActionButtons iconButtons={iconButtons} />

			<SyntaxHighlighter
				language="xml"
				style={atomOneDark}
				lineProps={{ style: { wordBreak: "break-all", whiteSpace: "pre-wrap" } }}
				wrapLines={true}
				showLineNumbers={true}
				customStyle={{ height: "100%" }}
			>
				{rawXmlString}
			</SyntaxHighlighter>
		</div>
	);
};

export default XmlVisualizerPanel;
