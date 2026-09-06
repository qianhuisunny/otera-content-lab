import { RichTextEditor } from "./RichTextEditor.jsx";
import { CoveragePanel } from "./CoveragePanel.jsx";
import { WritingPageHeader } from "./WritingPageHeader.jsx";
import { COVERAGE_ITEMS } from "../../data/writingScenario.js";

export function ReviewStep({ articleHtml, coverageItems = COVERAGE_ITEMS, dispatch }) {
  return (
    <section className="writing-page">
      <WritingPageHeader
        description="Edit the article directly while keeping the original evidence posture in view."
        meta="Review"
        title="Review & edit"
      />
      <div className="review-layout">
        <RichTextEditor
          onChange={(value) => dispatch({ type: "set-article-html", value })}
          value={articleHtml}
        />
        <CoveragePanel items={coverageItems} />
      </div>
    </section>
  );
}
