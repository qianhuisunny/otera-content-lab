import { useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { Button } from "@qianhui/ui";
import { WRITING_SCENARIO } from "../../data/writingScenario.js";
import { validateBrief } from "../../data/writingSession.js";
import { WritingPageHeader } from "./WritingPageHeader.jsx";

const FORMAT_OPTIONS = ["Explainer", "Technical guide", "Executive brief"];
const AUDIENCE_OPTIONS = WRITING_SCENARIO.brief.audiences;
const REQUIRED_FIELDS = ["format", "audiences", "keyword", "targetLength"];

export function BriefStep({ brief, dispatch, onAdvance }) {
  const [errors, setErrors] = useState({});
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const [isAudienceMenuOpen, setIsAudienceMenuOpen] = useState(false);
  const formatRef = useRef(null);
  const audiencesRef = useRef(null);
  const keywordRef = useRef(null);
  const targetLengthRef = useRef(null);
  const requiredControlRefs = {
    format: formatRef,
    audiences: audiencesRef,
    keyword: keywordRef,
    targetLength: targetLengthRef,
  };

  const updateField = (event) => {
    dispatch({ type: "set-brief-field", field: event.target.name, value: event.target.value });
  };

  const removeAudience = (audience) => {
    dispatch({ type: "set-audiences", value: brief.audiences.filter((item) => item !== audience) });
  };

  const addAudience = (audience) => {
    dispatch({ type: "set-audiences", value: [...brief.audiences, audience] });
    setIsAudienceMenuOpen(false);
  };

  const submitBrief = (event) => {
    event.preventDefault();
    const nextErrors = validateBrief(brief);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onAdvance();
      return;
    }

    const firstInvalidField = REQUIRED_FIELDS.find((field) => nextErrors[field]);
    requiredControlRefs[firstInvalidField]?.current?.focus();
  };

  const availableAudiences = AUDIENCE_OPTIONS.filter((audience) => !brief.audiences.includes(audience));

  return (
    <section className="writing-page">
      <WritingPageHeader
        title="Pick angle & format"
        description="Set the article's intent, audience, and search posture before planning its structure."
        meta="Brief"
      />

      <form className="writing-form" onSubmit={submitBrief}>
        <div className="writing-field">
          <label htmlFor="opportunity">Linked opportunity</label>
          <input
            id="opportunity"
            name="opportunity"
            onChange={updateField}
            type="text"
            value={brief.opportunity}
          />
        </div>

        <fieldset className="writing-field">
          <legend>Article format</legend>
          <button
            aria-controls="format-options"
            aria-expanded={isFormatMenuOpen}
            aria-invalid={Boolean(errors.format)}
            className="writing-menu-trigger"
            onClick={() => setIsFormatMenuOpen((isOpen) => !isOpen)}
            ref={requiredControlRefs.format}
            type="button"
          >
            <span>{brief.format || "Choose a format"}</span>
            <CaretDown aria-hidden="true" size={16} weight="bold" />
          </button>
          {isFormatMenuOpen ? (
            <div className="writing-menu-card" id="format-options" role="menu">
              {FORMAT_OPTIONS.map((format) => (
                <button
                  aria-checked={brief.format === format}
                  key={format}
                  onClick={() => {
                    dispatch({ type: "set-brief-field", field: "format", value: format });
                    setIsFormatMenuOpen(false);
                  }}
                  role="menuitemradio"
                  type="button"
                >
                  {format}
                </button>
              ))}
            </div>
          ) : null}
          {errors.format ? <p className="writing-error" role="alert">{errors.format}</p> : null}
        </fieldset>

        <fieldset className="writing-field">
          <legend dangerouslySetInnerHTML={{ __html: "Who it's for" }} />
          <div className="writing-audiences">
            {brief.audiences.map((audience) => (
              <span className="writing-audience-chip" key={audience}>
                {audience}
                <button aria-label={`Remove ${audience}`} onClick={() => removeAudience(audience)} type="button">
                  Remove
                </button>
              </span>
            ))}
          </div>
          <button
            aria-controls="audience-suggestions"
            aria-expanded={isAudienceMenuOpen}
            aria-invalid={Boolean(errors.audiences)}
            className="writing-menu-trigger writing-menu-trigger--inline"
            onClick={() => setIsAudienceMenuOpen((isOpen) => !isOpen)}
            ref={requiredControlRefs.audiences}
            type="button"
          >
            Add audience <CaretDown aria-hidden="true" size={14} weight="bold" />
          </button>
          {isAudienceMenuOpen ? (
            <div className="writing-menu-card" id="audience-suggestions">
              {availableAudiences.length ? (
                availableAudiences.map((audience) => (
                  <button key={audience} onClick={() => addAudience(audience)} type="button">
                    {audience}
                  </button>
                ))
              ) : (
                <p>All approved audiences are selected.</p>
              )}
            </div>
          ) : null}
          {errors.audiences ? <p className="writing-error" role="alert">{errors.audiences}</p> : null}
        </fieldset>

        <div className="writing-field">
          <label htmlFor="keyword">Primary keyword</label>
          <input
            aria-invalid={Boolean(errors.keyword)}
            id="keyword"
            name="keyword"
            onChange={updateField}
            ref={requiredControlRefs.keyword}
            type="text"
            value={brief.keyword}
          />
          {errors.keyword ? <p className="writing-error" role="alert">{errors.keyword}</p> : null}
        </div>

        <div className="writing-field">
          <label htmlFor="intent">What the searcher wants</label>
          <textarea id="intent" name="intent" onChange={updateField} rows={5} value={brief.intent} />
        </div>

        <div className="writing-field">
          <label htmlFor="directions">Additional directions</label>
          <textarea id="directions" name="directions" onChange={updateField} rows={4} value={brief.directions} />
        </div>

        <div className="writing-field">
          <label htmlFor="targetLength">Target length</label>
          <input
            aria-invalid={Boolean(errors.targetLength)}
            id="targetLength"
            name="targetLength"
            onChange={updateField}
            ref={requiredControlRefs.targetLength}
            type="text"
            value={brief.targetLength}
          />
          {errors.targetLength ? <p className="writing-error" role="alert">{errors.targetLength}</p> : null}
        </div>

        <div className="writing-actions">
          <Button onClick={() => dispatch({ type: "reset-outline" })} type="button" variant="secondary">
            Regenerate outline
          </Button>
          <Button type="submit">Plan outline</Button>
        </div>
      </form>
    </section>
  );
}
