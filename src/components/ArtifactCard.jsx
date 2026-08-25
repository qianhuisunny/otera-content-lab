import {
  ArrowSquareOut,
  CaretRight,
  FileText,
  GitBranch,
} from "@phosphor-icons/react";
import { Button } from "@qianhui/ui";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveArtifactHref } from "../data/artifactUtils";

function MarkdownLink({ href = "", children }) {
  const resolvedHref = resolveArtifactHref(href);
  const isExternal = /^https?:/i.test(resolvedHref);

  return (
    <a
      href={resolvedHref}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      {children}
      {isExternal ? <ArrowSquareOut size={13} aria-hidden="true" /> : null}
    </a>
  );
}

function MarkdownHeading({ as: Heading, className, children }) {
  return <Heading className={`markdown-heading ${className}`}>{children}</Heading>;
}

export function ArtifactCard({ artifact, expanded, onToggle }) {
  const contentId = `artifact-content-${artifact.id}`;

  return (
    <article
      className={`artifact-card${expanded ? " artifact-card--expanded" : ""}`}
      id={`artifact-${artifact.id}`}
      aria-label={`${artifact.title} context artifact`}
      data-expanded={expanded}
    >
      <div className="artifact-card__header">
        <div className="artifact-title-row">
          <span className="artifact-icon" aria-hidden="true">
            <FileText size={18} weight="regular" />
          </span>
          <div>
            <h3>{artifact.title}</h3>
            <code>{artifact.artifactKey}</code>
          </div>
        </div>
        <span className="line-count">{artifact.lineCount} lines</span>
      </div>

      <p className="artifact-description">{artifact.description}</p>
      <p className="artifact-preview">{artifact.preview}</p>

      <div className="artifact-tags" aria-label={`${artifact.title} topics`}>
        {artifact.tags.slice(0, 5).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="artifact-card__footer">
        <span className="artifact-source">
          <GitBranch size={15} aria-hidden="true" />
          <span>{artifact.contentPath}</span>
        </span>
        <Button
          className="artifact-toggle"
          variant="secondary"
          size="sm"
          type="button"
          aria-label={`${expanded ? "Close" : "Read"} ${artifact.title} context`}
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={onToggle}
        >
          {expanded ? "Close" : "Read"}
          <CaretRight size={15} weight="bold" aria-hidden="true" />
        </Button>
      </div>

      {expanded ? (
        <div className="artifact-content" id={contentId}>
          <div className="artifact-content__label">
            <span>Full source context</span>
            <small>Public-source synthesis · attribution required</small>
          </div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: MarkdownLink,
              h1: ({ children }) => (
                <MarkdownHeading as="h4" className="markdown-h1">
                  {children}
                </MarkdownHeading>
              ),
              h2: ({ children }) => (
                <MarkdownHeading as="h5" className="markdown-h2">
                  {children}
                </MarkdownHeading>
              ),
              h3: ({ children }) => (
                <MarkdownHeading as="h6" className="markdown-h3">
                  {children}
                </MarkdownHeading>
              ),
              h4: ({ children }) => (
                <MarkdownHeading as="h6" className="markdown-h4">
                  {children}
                </MarkdownHeading>
              ),
              h5: ({ children }) => (
                <MarkdownHeading as="h6" className="markdown-h5">
                  {children}
                </MarkdownHeading>
              ),
              h6: ({ children }) => (
                <MarkdownHeading as="h6" className="markdown-h6">
                  {children}
                </MarkdownHeading>
              ),
            }}
          >
            {artifact.content}
          </ReactMarkdown>
        </div>
      ) : null}
    </article>
  );
}
