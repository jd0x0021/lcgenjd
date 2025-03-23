/*=======================================================================
  All of the code responsible for generating audit fields will be here.
=======================================================================*/

import {
	AuditFieldValues,
	AuditFieldVariant,
	populateAuditFieldValues,
} from "~/components/AuditField";
import { newLine, tab } from "~/utils/characterUtils";

/**
 * This function generates the xml representation of audit fields based on their {@link AuditFieldVariant}.
 *
 * @param auditFieldVariant
 * @param changeSetId
 * @returns
 */
export const auditFieldXmlStringBuilder = (
	auditFieldVariant: AuditFieldVariant,
	changeSetId: string
): string => {
	const auditFieldValues: AuditFieldValues = populateAuditFieldValues(auditFieldVariant);
	const insertedBy = auditFieldValues.INSERTED_BY;
	const insertedTimestamp = auditFieldValues.INSERTED_TIMESTAMP;
	const lastUpdatedBy = auditFieldValues.LAST_UPDATED_BY;
	const lastUpdatedTimestamp = auditFieldValues.LAST_UPDATED_TIMESTAMP;

	return [
		`${tab(3)}<column name="${insertedBy}" value="${changeSetId}"/>`,
		`${tab(3)}<column name="${insertedTimestamp}" valueComputed="SYSDATE"/>`,
		`${tab(3)}<column name="${lastUpdatedBy}" value="${changeSetId}"/>`,
		`${tab(3)}<column name="${lastUpdatedTimestamp}" valueComputed="SYSDATE"/>`,
	].join(newLine(1));
};
