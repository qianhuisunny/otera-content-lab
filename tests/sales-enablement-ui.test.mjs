import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let vite;
before(async () => {
  vite = await createServer({
    appType: "custom", logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false },
  });
});
after(async () => vite.close());

const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));
function elements(node) {
  if (!React.isValidElement(node)) return [];
  return [node, ...React.Children.toArray(node.props.children).flatMap(elements)];
}
async function workspaceModules() {
  const { SalesEnablementWorkspace } = await vite.ssrLoadModule(
    "/src/components/sales-enablement/SalesEnablementWorkspace.jsx");
  const { createSalesEnablementSession } = await vite.ssrLoadModule("/src/data/salesEnablementSession.js");
  return { SalesEnablementWorkspace, session: createSalesEnablementSession() };
}

// Render with React's real hook state, invoking the controls returned by App.
// This keeps transition coverage independent of a browser or a mocked reducer.
function renderAppTransitions(App, initialProps, actions, inspectFinal = () => {}) {
  function Harness() {
    const step = React.useRef(0);
    const tree = App(initialProps);
    const action = actions[step.current];
    if (action) {
      step.current += 1;
      action(elements(tree));
    } else {
      inspectFinal(elements(tree));
    }
    return tree;
  }
  return render(Harness);
}

test("switching away from Retell exits Sales Enablement with coherent company chrome", async () => {
  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const markup = renderAppTransitions(App, { initialView: "sales-enablement" }, [
    (nodes) => nodes.find(({ props }) => props.ariaLabel === "Select company context")
      .props.onValueChange("otera"),
  ]);
  assert.match(markup, /Otera content navigation/);
  assert.match(markup, /aria-label="Content workflow"/);
  assert.doesNotMatch(markup, /data-sales-enablement-workspace/);
});

test("selecting Retell keeps its sales scope, and company switching still works in Context", async () => {
  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const salesMarkup = renderAppTransitions(App, { initialView: "sales-enablement" }, [
    (nodes) => nodes.find(({ props }) => props.ariaLabel === "Select company context")
      .props.onValueChange("retell"),
  ]);
  assert.match(salesMarkup, /data-sales-enablement-workspace/);
  const contextMarkup = renderAppTransitions(App, {}, [
    (nodes) => nodes.find(({ props }) => props.ariaLabel === "Select company context")
      .props.onValueChange("retell"),
  ]);
  assert.match(contextMarkup, /Retell AI context artifacts/);
  assert.doesNotMatch(contextMarkup, /aria-label="Content workflow"/);
});

test("Back to Workflow restores focus to the mounted Sales Enablement action only once", async () => {
  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const { WorkflowView } = await vite.ssrLoadModule("/src/components/WorkflowView.jsx");
  let focusCount = 0;
  const markup = renderAppTransitions(App, { initialView: "workflow" }, [
    (nodes) => nodes.find(({ type }) => type === WorkflowView).props.onOpenSalesEnablement(),
    (nodes) => nodes.find(({ props }) => props.session?.activeStepId === "scope").props.onExit(),
  ], (nodes) => {
    const workflow = nodes.find(({ type }) => type === WorkflowView);
    const writePhase = elements(WorkflowView(workflow.props))
      .find(({ props }) => props.phase?.heading === "WRITE");
    const tile = elements(writePhase.type(writePhase.props))
      .find(({ props }) => props["aria-label"] === "Open Sales Enablement Deck");
    assert.equal(typeof tile.props.ref, "function");
    // Attach the rendered tile's actual ref, as React does on DOM commit.
    const node = { focus: () => { focusCount += 1; } };
    tile.props.ref(node);
    tile.props.ref(null);
    tile.props.ref(node);
  });
  assert.match(markup, /aria-label="Content workflow"/);
  assert.equal(focusCount, 1);
});

test("sales deep entry selects Retell and Workflow without adding a primary tab", async () => {
  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const markup = render(App, { initialView: "sales-enablement" });
  assert.match(markup, /data-sales-enablement-workspace/);
  assert.match(markup, /Sales Enablement Deck/);
  assert.match(markup, /Retell AI content navigation/);
  assert.match(markup, /Example run/);
  assert.match(markup, /Run live/);
  const navigation = markup.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? "";
  assert.equal((navigation.match(/role="tab"/g) ?? []).length, 2);
  assert.match(navigation, /<button[^>]*aria-selected="true"[^>]*id="workflow-tab"[^>]*tabindex="0"/);
  assert.match(markup, /aria-labelledby="workflow-tab" id="content-view-panel"/);
});

test("Workflow renders actions only for supplied callbacks", async () => {
  const { WorkflowView } = await vite.ssrLoadModule("/src/components/WorkflowView.jsx");
  assert.doesNotMatch(render(WorkflowView, {}), /<button/);
  const markup = render(WorkflowView, { onOpenLongForm() {}, onOpenSalesEnablement() {} });
  assert.equal((markup.match(/<button/g) ?? []).length, 2);
  assert.match(markup, /<button[^>]*aria-label="Open Sales Enablement Deck"/);
  assert.match(markup, /<button[^>]*aria-label="Open Long-Form Blog Article"/);
});

test("the scope shell renders the five canonical stages once and the editable scenario", async () => {
  const { SalesEnablementWorkspace, session } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, { session, dispatch() {}, onExit() {} });
  for (const label of ["Define scope", "Gather evidence", "Build narrative", "Generate deck", "Validate readiness"]) {
    assert.equal(markup.split(label).length - 1, 1, label);
  }
  assert.match(markup, /Move an AI voice-agent workflow/);
  assert.doesNotMatch(markup, /Situation-Specific, Not Generic|Sales Uses What Sales Trusts/);
  assert.equal((markup.match(/aria-current="step"/g) ?? []).length, 1);
});

test("non-scope steps show their manifest overview", async () => {
  const { SalesEnablementWorkspace, session } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, {
    session: { ...session, activeStepId: "research" }, dispatch() {}, onExit() {},
  });
  assert.match(markup, /<h2 id="sales-stage-research">Gather evidence<\/h2>/);
  assert.match(markup, /Route Retell context across seven focused research workstreams./);
  assert.doesNotMatch(markup, /name="sellerName"/);
});

test("step keyboard navigation supports both arrows, wrapping, Home, and End", async () => {
  const { getNextSalesStepIndex } = await vite.ssrLoadModule(
    "/src/components/sales-enablement/SalesEnablementStepNavigator.jsx");
  for (const [key, index, expected] of [
    ["ArrowRight", 1, 2], ["ArrowLeft", 0, 4], ["ArrowDown", 4, 0],
    ["ArrowUp", 2, 1], ["Home", 3, 0], ["End", 1, 4], ["Escape", 1, null],
  ]) assert.equal(getNextSalesStepIndex(key, index, 5), expected);
});

test("scope controls expose labels and edit every input through the reducer contract", async () => {
  const { SalesEnablementScopeStep } = await vite.ssrLoadModule(
    "/src/components/sales-enablement/SalesEnablementScopeStep.jsx");
  const { createSalesEnablementSession, salesEnablementReducer } = await vite.ssrLoadModule(
    "/src/data/salesEnablementSession.js");
  let session = createSalesEnablementSession();
  const tree = SalesEnablementScopeStep({ input: session.input,
    dispatch: (action) => { session = salesEnablementReducer(session, action); } });
  const nodes = elements(tree);
  const controls = nodes.filter(({ type }) => ["input", "select", "textarea"].includes(type));
  assert.equal(controls.length, 8);
  const edits = {
    sellerName: "Retell team", salesStage: "proposal", primaryBuyer: "workflow_owner",
    supportingBuyer: "governance_approver", buyerProblem: "Call quality",
    desiredNextStep: "Pilot review", competitorContext: "Internal build",
    knownObjections: "Cost\n\nOperational ownership\n",
  };
  for (const control of controls) {
    const { name, id, value, onChange } = control.props;
    assert.ok(nodes.some((node) => node.type === "label" && node.props.htmlFor === id));
    assert.notEqual(value, undefined);
    onChange({ target: { name, value: edits[name] } });
  }
  assert.deepEqual(session.input, {
    ...createSalesEnablementSession().input, ...edits,
    knownObjections: ["Cost", "", "Operational ownership", ""],
  });
  for (const name of ["primaryBuyer", "supportingBuyer"]) {
    const select = controls.find((node) => node.props.name === name);
    assert.deepEqual(elements(select).filter((node) => node.type === "option").map((node) => node.props.value), [
      "executive_sponsor", "workflow_owner", "technical_owner", "agent_builder",
      "conversation_quality_owner", "governance_approver", "solution_partner_platform_operator",
    ]);
  }
  assert.deepEqual(elements(controls.find((node) => node.props.name === "salesStage"))
    .filter((node) => node.type === "option").map((node) => node.props.value),
  ["discovery", "demo", "evaluation", "proposal"]);
});

test("live action stays disabled until configured and idle without a retry block", async () => {
  const { SalesEnablementWorkspace, session } = await workspaceModules();
  for (const [configured, requestStatus, retryBlocked, disabled] of [
    [false, "idle", false, true], [true, "creating", false, true],
    [true, "polling", false, true], [true, "idle", true, true], [true, "idle", false, false],
  ]) {
    const markup = render(SalesEnablementWorkspace, {
      session: { ...session, provider: { checked: true, configured }, requestStatus, retryBlocked },
      dispatch() {}, onExit() {}, onRunLive() {},
    });
    const button = markup.match(/<button\b[^>]*>Run live<\/button>/)?.[0] ?? "";
    assert.ok(button);
    assert.equal(button.includes('disabled=""'), disabled);
    assert.equal(markup.includes("Live execution is not configured."), !configured);
  }
});

test("run status renders public lifecycle copy and accessible failures", async () => {
  const { SalesEnablementRunStatus } = await vite.ssrLoadModule(
    "/src/components/sales-enablement/SalesEnablementRunStatus.jsx");
  for (const [status, copy] of [
    ["completed", "Ready to inspect"], ["queued", "Queued"],
    ["in_progress", "Research in progress"], ["failed", "Needs attention"],
  ]) {
    const markup = render(SalesEnablementRunStatus, {
      mode: "live", run: { status, error: status === "failed" ? { message: "Please try again." } : null },
    });
    assert.match(markup, /aria-live="polite"/);
    assert.ok(markup.includes(copy));
    assert.match(markup, /Live run/);
    if (status === "failed") assert.match(markup, /role="alert">Please try again./);
  }
});
