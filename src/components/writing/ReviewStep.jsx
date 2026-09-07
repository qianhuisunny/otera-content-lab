import { RichTextEditor } from "./RichTextEditor.jsx";
import { WritingPageHeader } from "./WritingPageHeader.jsx";

export function ReviewStep({ articleHtml, dispatch }) {
  return (
    <section className="writing-page">
      <WritingPageHeader
        description="Edit the article directly while keeping the original evidence posture in view."
        meta="Review"
        title="Review & edit"
      />
      <RichTextEditor
        onChange={(value) => dispatch({ type: "set-article-html", value })}
        value={articleHtml}
      />
    </section>
  );
}
