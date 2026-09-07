import { WRITING_SCENARIO } from "../../data/writingScenario.js";
import { WorkflowTopbar } from "./WorkflowTopbar.jsx";

export function WritingTopbar({ onExit, scenario = WRITING_SCENARIO }) {
  return WorkflowTopbar({
    eyebrow: "CREATING PAGE FOR",
    itemId: scenario.articleId,
    onExit,
    status: scenario.status,
    title: scenario.title,
  });
}
