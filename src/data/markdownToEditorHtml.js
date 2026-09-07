import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function markdownToEditorHtml(markdown) {
  const html = renderToStaticMarkup(React.createElement(ReactMarkdown, {
    skipHtml: true,
    remarkPlugins: [remarkGfm],
    allowedElements: ["h1", "h2", "h3", "h4", "p", "strong", "em", "del", "ul", "ol", "li", "blockquote", "code", "pre", "a", "hr", "br", "table", "thead", "tbody", "tr", "th", "td"],
    urlTransform: (url) => {
      try { return ["https:", "http:"].includes(new URL(url).protocol) ? url : ""; }
      catch { return ""; }
    },
    children: markdown,
  }));
  if (!html.replace(/<[^>]*>/g, "").replace(/&nbsp;|&#160;/g, " ").trim()) {
    throw new Error("The model returned no editable text after safe formatting. Please try again; your existing edits have been kept.");
  }
  return html;
}
