export function WritingPageHeader({ title, description, meta, id }) {
  return (
    <header className="writing-page-header">
      {meta ? <div className="writing-page-header__meta">{meta}</div> : null}
      <h1 data-writing-page-heading="" id={id} tabIndex={-1}>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
