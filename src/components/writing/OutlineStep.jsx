import { useState } from "react";
import { Button } from "@qianhui/ui";
import { WritingPageHeader } from "./WritingPageHeader.jsx";

export function OutlineStep({ outline, dispatch, onAdvance, onBack }) {
  const [error, setError] = useState("");

  const submitOutline = (event) => {
    event.preventDefault();
    const trimmedOutline = outline.trim();
    if (!trimmedOutline) {
      setError("Add at least one outline section.");
      return;
    }

    if (trimmedOutline !== outline) {
      dispatch({ type: "set-outline", value: trimmedOutline });
    }
    setError("");
    onAdvance();
  };

  return (
    <section className="writing-page">
      <WritingPageHeader
        title="Plan outline"
        description="Shape the article's structure before generating the first complete version."
        meta="Outline"
      />

      <form className="writing-form" onSubmit={submitOutline}>
        <div className="writing-field">
          <label htmlFor="outline">Article outline</label>
          <p className="writing-field__helper" id="outline-helper">
            Use h2: for main sections, h3: for subsections, and [brackets] for writing guidance.
          </p>
          <textarea
            aria-describedby="outline-helper"
            aria-invalid={Boolean(error)}
            className="writing-outline-editor"
            id="outline"
            onChange={(event) => dispatch({ type: "set-outline", value: event.target.value })}
            value={outline}
          />
          {error ? <p aria-live="polite" className="writing-error">{error}</p> : null}
        </div>

        <div className="writing-actions">
          <Button onClick={onBack} type="button" variant="secondary">
            Back to brief
          </Button>
          <Button type="submit">Draft first version</Button>
        </div>
      </form>
    </section>
  );
}
