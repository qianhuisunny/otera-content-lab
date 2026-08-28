import { useState } from "react";
import { CaretDown, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@qianhui/ui";
import { ACTIVITY_ITEMS, WRITING_SCENARIO } from "../../data/writingScenario.js";
import { buildResearchMarkdown } from "../../data/writingSession.js";
import { WritingPageHeader } from "./WritingPageHeader.jsx";

export function downloadResearchMarkdown() {
  let objectUrl = "";
  let link;
  try {
    const file = new Blob([buildResearchMarkdown()], { type: "text/markdown;charset=utf-8" });
    objectUrl = URL.createObjectURL(file);
    link = document.createElement("a");
    link.href = objectUrl;
    link.download = "otera-governed-claims-research.md";
    document.body.append(link);
    link.click();
  } finally {
    try {
      link?.remove();
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }
}

export function DraftStep({ onAdvance }) {
  const [openActivityIds, setOpenActivityIds] = useState(new Set(["post"]));
  const [isResearchOpen, setIsResearchOpen] = useState(true);
  const [exportError, setExportError] = useState("");

  const toggleActivity = (id) => {
    setOpenActivityIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(id)) nextIds.delete(id);
      else nextIds.add(id);
      return nextIds;
    });
  };

  const inspectActivity = () => {
    setOpenActivityIds(new Set(ACTIVITY_ITEMS.map((item) => item.id)));
  };

  const exportResearch = () => {
    try {
      downloadResearchMarkdown();
      setExportError("");
    } catch {
      setExportError("Research export could not be created.");
    }
  };

  return (
    <section className="writing-page">
      <WritingPageHeader
        title="Drafted first version"
        description="The approved outline has been drafted with the research and attribution posture preserved for review."
        meta="25m · 8 sources · 2,940 words · Target: 2,500–3,200"
      />

      <section aria-labelledby="writing-activity-title" className="writing-activity">
        <div className="writing-section-bar">
          <div>
            <h2 id="writing-activity-title">Activity</h2>
            <p>Each drafting step is complete and available for inspection.</p>
          </div>
          <Button onClick={inspectActivity} type="button" variant="secondary">
            Inspect
          </Button>
        </div>

        <div className="writing-activity__cards">
          {ACTIVITY_ITEMS.map((item) => {
            const isOpen = openActivityIds.has(item.id);
            const panelId = `activity-details-${item.id}`;
            return (
              <article className="activity-card" key={item.id}>
                <button
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  className="activity-card__summary"
                  onClick={() => toggleActivity(item.id)}
                  type="button"
                >
                  <CheckCircle aria-hidden="true" size={20} weight="fill" />
                  <span>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </span>
                  <CaretDown aria-hidden="true" size={18} weight="bold" />
                </button>
                <div className="activity-details" hidden={!isOpen} id={panelId}>
                  {item.details ? (
                    item.details.map((detail) => (
                      <p className="activity-detail" key={detail}>
                        {detail}
                      </p>
                    ))
                  ) : (
                    <p className="activity-detail">Completed using the approved brief, outline, and evidence posture.</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="research-title" className="writing-activity">
        <button
          aria-controls="research-details"
          aria-expanded={isResearchOpen}
          className="writing-section-bar"
          onClick={() => setIsResearchOpen((isOpen) => !isOpen)}
          type="button"
        >
          <span>
            <span id="research-title">Research</span>
            <span>Source-aware notes used to shape this draft.</span>
          </span>
          <CaretDown aria-hidden="true" size={18} weight="bold" />
        </button>
        <div className="research-summary" hidden={!isResearchOpen} id="research-details">
          <h2>{WRITING_SCENARIO.researchTitle}</h2>
          <p>{WRITING_SCENARIO.researchSummary}</p>
          <Button onClick={exportResearch} type="button" variant="secondary">
            Export research
          </Button>
          <p aria-live="polite" className="writing-error">
            {exportError}
          </p>
        </div>
      </section>

      <div className="writing-actions">
        <span className="writing-helper">The draft is ready for editorial review.</span>
        <Button onClick={onAdvance} type="button">
          <span>Review & edit</span>
        </Button>
      </div>
    </section>
  );
}
