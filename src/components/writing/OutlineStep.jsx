import { useState } from "react";
import { Button } from "@qianhui/ui";
import { WritingPageHeader } from "./WritingPageHeader.jsx";

export function clearResolvedOutlineError(error, outline) {
  return error && outline.trim() ? "" : error;
}
export function OutlineStep({ outline, dispatch, onAdvance, onBack }) {
  const [error, setError] = useState("");

  const updateOutline = (event) => {
    const { value } = event.target;
    dispatch({ type: "set-outline", value });
    setError((currentError) => clearResolvedOutlineError(currentError, value));
  };

  const submitOutline = (event) => {
    event.preventDefault();
    if (!outline.trim()) {
      setError("Add at least one outline section.");
      return;
    }

    setError("");
    onAdvance();
  };

  return (
    <section className="writing-page">
      <WritingPageHeader
        title="Plan outline"
        description="Shape the article into a useful, evidence-aware sequence before drafting."
        meta="Outline"
      />

      <form className="writing-form" onSubmit={submitOutline}>
        <div className="writing-field">
          <label htmlFor="writing-outline">Article outline</label>
          <p className="writing-helper" id="writing-outline-help">
            Use h2: for main sections, h3: for supporting sections, and [brackets] for drafting notes.
          </p>
          <textarea
            aria-describedby="writing-outline-help writing-outline-error"
            aria-invalid={Boolean(error)}
            className="writing-outline-editor"
            id="writing-outline"
            name="outline"
            onChange={updateOutline}
            value={outline}
          />
          <p aria-live="polite" className="writing-error" id="writing-outline-error">
            {error}
          </p>
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
