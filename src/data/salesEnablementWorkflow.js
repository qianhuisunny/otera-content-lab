import workflow from "../../skills/sales-enablement/workflow.json" with { type: "json" };
import { STAGE_IDS, WORKSTREAM_IDS } from "./salesEnablementContract.js";

function sameIds(records, ids) {
  return Array.isArray(records) && records.length === ids.length &&
    records.every(({ id }, index) => id === ids[index]);
}

function validateWorkflow(value) {
  if (value?.id !== "sales-enablement" || value?.companyId !== "retell") {
    throw new TypeError("Unsupported sales enablement workflow.");
  }
  if (!sameIds(value.stages, STAGE_IDS) || !sameIds(value.workstreams, WORKSTREAM_IDS)) {
    throw new TypeError("The sales enablement manifest IDs are invalid.");
  }
  if (value.stages.some(({ label, description, sources }) =>
    typeof label !== "string" || !label || typeof description !== "string" || !description ||
    !Array.isArray(sources) || !sources.length)) {
    throw new TypeError("Every sales enablement stage needs display metadata and sources.");
  }
  return Object.freeze(value);
}

export const SALES_ENABLEMENT_WORKFLOW = validateWorkflow(workflow);
