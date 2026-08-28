import { RichTextEditor } from "./RichTextEditor.jsx";
import { CoveragePanel } from "./CoveragePanel.jsx";
import { WritingPageHeader } from "./WritingPageHeader.jsx";

export function ReviewStep({ articleHtml, dispatch }) {
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
        <CoveragePanel />
      </div>
    </section>
  );
}
