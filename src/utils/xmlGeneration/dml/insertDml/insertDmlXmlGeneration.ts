/*=============================================
  All of the code responsible for generating 
  xml strings for an Insert DML will be here.
=============================================*/

import { AuditFieldValues, populateAuditFieldValues } from "~/components/AuditField";
import { DatabaseTableType } from "~/components/DatabaseTable/DatabaseTableContent";
import { InsertDmlType } from "~/types/DML";
import { newLine, tab } from "~/utils/characterUtils";
import { auditFieldXmlStringBuilder } from "~/utils/xmlGeneration/auditFieldsXmlGeneration";
import { insertDmlDisplayTableHasRows } from "~/utils/xmlGeneration/dml/insertDml/insertDmlUtils";

const LONG_DATE_FORMAT_LENGTH: number = 11;
const VALUE_NUMERIC = "valueNumeric" as const;
const VALUE = "value" as const;

/**
 * This function converts an {@link InsertDmlType}'s data to their xml string representations.
 *
 * @param insertDML
 * @param databaseTableName
 * @returns
 */
export const insertDmlXmlStringBuilder = (
	insertDML: InsertDmlType,
	databaseTableName: string,
	changeSetId: string
): string => {
	const columnNames: Map<string, string> = new Map(
		insertDML.valuesToInsert.dbColumnNames.map((columnName) => [columnName.id, columnName.text])
	);

	// a 'row' object represents 1 <insert> dml block
	return insertDML.valuesToInsert.dbRowValues
		.map((row) => {
			const columnValues: string = row.cells
				.map((rowCell) => {
					const columnName: string = columnNames.get(rowCell.colId) as string;
					const columnValue: string = rowCell.text;
					return columnStringBuilder(columnName, columnValue);
				})
				.join(`${newLine(1)}${tab(3)}`);
			const auditFieldXmlValues: string = auditFieldXmlStringBuilder(
				insertDML.auditFieldVariant,
				changeSetId
			);

			const openingTag: string = `<insert schemaName="\${schema}" tableName="${databaseTableName}">`;
			const body: string = [columnValues, auditFieldXmlValues].join(newLine(1));
			const closingTag: string = `</insert>`;

			return [`${tab(2)}${openingTag}`, `${tab(3)}${body}`, `${tab(2)}${closingTag}`].join(
				newLine(1)
			);
		})
		.join(newLine(2));
};

/**
 * This function generates the xml representation of an \<insert\> {@link InsertDmlType}'s rollback.
 * This is designed to rollback the inserted rows from the last tables (from the databaseTables array) first.
 * It is assumed that the inserted rows from the first tables will come from a parent table, and the inserted
 * rows from the last tables will come from child tables. Deleting the child table rows first are necessary in
 * order to properly delete the parent table rows when doing a rollback.
 *
 * @param databaseTables
 * @param changeSetId
 * @returns
 */
export const insertDmlRollbackStringBuilder = (
	databaseTables: DatabaseTableType[],
	changeSetId: string
): string => {
	const openingTag: string = `<rollback>`;
	const body: string = [...databaseTables]
		.reverse()
		.filter((databaseTable) => insertDmlDisplayTableHasRows(databaseTable))
		.map((databaseTable) => {
			// only map databaseTables with insert dmls, and those insert dmls should have at least 1 row

			const auditFieldValues: AuditFieldValues = populateAuditFieldValues(
				databaseTable.dml.auditFieldVariant
			);

			const deleteOpeningTag: string = `<delete schemaName="\${schema}" tableName="${databaseTable.name}">`;
			const deleteBody: string = [
				`${tab(4)}<where>${auditFieldValues.INSERTED_BY}=:value</where>`,
				`${tab(4)}<whereParams>`,
				`${tab(5)}<param value="${changeSetId}"/>`,
				`${tab(4)}</whereParams>`,
			].join(newLine(1));
			const deleteClosingTag: string = `</delete>`;

			return [
				`${tab(3)}${deleteOpeningTag}`,
				`${deleteBody}`,
				`${tab(3)}${deleteClosingTag}`,
			].join(newLine(1));
		})
		.join(newLine(2));
	const closingTag: string = `</rollback>`;

	return [`${tab(2)}${openingTag}`, body, `${tab(2)}${closingTag}`].join(newLine(1));
};

/**
 * Creates the xml string representation of the \<column\> tag. The value of the column tag will be
 * wrapped with a **CDATA tag** if the column's value has special characters or has non-ascii characters
 * like accented characters (e.g. ǎ, ë, ì, ó, û).
 *
 * @param columnName
 * @param columnValue
 * @returns
 */
const columnStringBuilder = (columnName: string, columnValue: string): string => {
	const valueAttributeLabel: string = columnValueAttributeLabel(columnName);

	if (valueAttributeLabel === VALUE_NUMERIC) {
		// don't enclose numeric values with CDATA tags (example numeric input
		// that is not a LITERAL number: ${schema}.TABLE_SEQUENCE_NAME.NEXTVAL)
		return `<column name="${columnName}" valueNumeric="${columnValue}"/>`;
	}

	const columnValueIsValidLongDate: boolean =
		columnValue.length === LONG_DATE_FORMAT_LENGTH && !isNaN(Date.parse(columnValue));

	if (columnValueIsValidLongDate) {
		// don't enclose valid long date formats with CDATA tags
		return `<column name="${columnName}" value="${columnValue}"/>`;
	}

	const columnValueHasSpecialCharacters: boolean = /[!-/:-@[-`{-~]/.test(columnValue); // except space character (' ')
	const columnValueHasNonAcsiiCharacters: boolean = /[^ -~]+/.test(columnValue);

	return columnValueHasSpecialCharacters || columnValueHasNonAcsiiCharacters
		? `<column name="${columnName}"><![CDATA[${columnValue}]]></column>`
		: `<column name="${columnName}" value="${columnValue}"/>`;
};

/**
 * The \<column\>'s value attribute will change to _valueNumeric_ if it's an ID column.
 *
 * @param columnName
 * @returns
 */
const columnValueAttributeLabel = (columnName: string): string => {
	const columnNameIsId = columnName.toLowerCase() === "id";
	const columnNameIsUnderscoreId = columnName.toLowerCase().slice(-3) === "_id";

	return columnNameIsId || columnNameIsUnderscoreId ? VALUE_NUMERIC : VALUE;
};
