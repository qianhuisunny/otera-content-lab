const buyerOptions = [
  ["executive_sponsor", "Executive sponsor"],
  ["workflow_owner", "Workflow owner"],
  ["technical_owner", "Technical owner"],
  ["agent_builder", "Agent builder"],
  ["conversation_quality_owner", "Conversation quality owner"],
  ["governance_approver", "Governance approver"],
  ["solution_partner_platform_operator", "Solution partner / platform operator"],
];

const scopeFields = [
  { name: "sellerName", label: "Seller", type: "input" },
  { name: "salesStage", label: "Sales stage", type: "select", options: [
    ["discovery", "Discovery"], ["demo", "Demo"],
    ["evaluation", "Evaluation"], ["proposal", "Proposal"],
  ] },
  { name: "primaryBuyer", label: "Primary buyer", type: "select", options: buyerOptions },
  { name: "supportingBuyer", label: "Supporting buyer", type: "select", options: buyerOptions },
  { name: "buyerProblem", label: "Buyer problem", type: "textarea" },
  { name: "desiredNextStep", label: "Desired next step", type: "textarea" },
  { name: "competitorContext", label: "Competitor context", type: "textarea" },
  { name: "knownObjections", label: "Known objections (one per line)", type: "textarea" },
];

export function SalesEnablementScopeStep({ input, dispatch }) {
  const updateField = (event) => {
    const { name: field, value } = event.target;
    dispatch({ type: "set-input", field,
      value: field === "knownObjections" ? value.split(/\r?\n/) : value });
  };

  return (
    <section className="sales-scope-step">
      <h2 id="sales-stage-scope">Deal scope</h2>
      <form className="sales-scope-form" onSubmit={(event) => event.preventDefault()}>
        {scopeFields.map(({ name, label, type, options }) => {
          const props = {
            id: `sales-${name}`, name, onChange: updateField,
            value: name === "knownObjections" ? input[name].join("\n") : input[name],
          };
          return (
            <div className="sales-field" key={name}>
              <label htmlFor={props.id}>{label}</label>
              {type === "select" ? (
                <select {...props}>
                  {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
                </select>
              ) : type === "textarea" ? (
                <textarea {...props} rows={name === "knownObjections" ? 5 : 3} />
              ) : <input {...props} type="text" />}
            </div>
          );
        })}
      </form>
    </section>
  );
}
