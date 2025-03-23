/*================================================
  All of the code responsible for generating xml 
  strings for a <changeSet> tag will be here.
================================================*/

import { DEFAULT_CHANGESET_ORDER, determineChangeSetLabel } from "~/components/ChangeSet";
import { ChangeLogType } from "~/contexts/ChangeLogContextProvider";
import { dmlToXmlStringBuilder, rollbackXmlStringBuilder } from "~/panels/XmlVisualizerPanel";
import { newLine, tab } from "~/utils/characterUtils";

/**
 * Generate the actual _changeSet id_ that will be seen in the _**changeSet id=""**_'s value when rendering the XML.
 *
 * The combination of the **logicalFilePath** and the **letter label** is the actual **changeSet id**.
 *
 * @param logicalFilePath
 * @param changeSetOrder the order of the changeSet in the list of changeSets
 * @returns
 */
const generateChangeSetId = (logicalFilePath: string, changeSetOrder: number): string => {
	let trimmedLogicalFilePath: string = logicalFilePath.trim();
	let logicalFilePathIsBlank: boolean = logicalFilePath === null || trimmedLogicalFilePath === "";

	return logicalFilePathIsBlank
		? trimmedLogicalFilePath
		: `${trimmedLogicalFilePath}${determineChangeSetLabel(changeSetOrder)}`;
};

/**
 * An XML String builder for the \<changeSet\> {@link ChangeSetType} tag.
 *
 * @param changeLog
 * @returns
 */
export const changeSetXmlStringBuilder = (changeLog: ChangeLogType): string => {
	const changeLogHasOneChangeSet: boolean = changeLog.changeSets.length === 1;

	return changeLog.changeSets
		.map((changeSet, i) => {
			// the order of the changeSet in the list of changeSets
			const changeSetOrder: number = changeLogHasOneChangeSet ? DEFAULT_CHANGESET_ORDER : i;
			const changeSetId: string = generateChangeSetId(
				changeLog.metaData.logicalFilePath,
				changeSetOrder
			);

			const author: string = changeLog.metaData.author.trim();
			const comment: string = changeSet.comment === undefined ? "" : changeSet.comment.trim();
			const dmlValues: string = dmlToXmlStringBuilder(changeSet.databaseTables, changeSetId);

			const openingTag: string = `<changeSet id="${changeSetId}" author="${author}" context="refData">`;
			const body: string[] = [`<comment>${comment}</comment>`];
			const closingTag: string = `</changeSet>`;

			// we should only add our dmlValues to the body of the xml if it
			// has values to avoid the unnecessary white space on the rendered
			// <changeSet> xml string when dmlValues doesn't have any values
			if (typeof dmlValues != "undefined" && dmlValues) {
				body.push(dmlValues);
				body.push(
					rollbackXmlStringBuilder(
						changeSet.databaseTablesDMLVariant,
						changeSet.databaseTables,
						changeSetId
					)
				);
			}

			return [
				`${tab(1)}${openingTag}`,
				`${tab(2)}${body.join(newLine(2))}`,
				`${tab(1)}${closingTag}`,
			].join(newLine(1));
		})
		.join(newLine(2));
};
