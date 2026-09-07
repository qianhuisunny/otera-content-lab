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

test("Sales Enablement uses the dedicated workflow topbar and restores company chrome on exit", async () => {
  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const salesMarkup = render(App, { initialView: "sales-enablement" });
  assert.match(salesMarkup, /class="writing-topbar"/);
  assert.match(salesMarkup, /CREATING DECK FOR/);
  assert.match(salesMarkup, /STATUS: Ready to inspect/);
  assert.doesNotMatch(salesMarkup, /class="app-topbar"|Select company context/);

  const markup = renderAppTransitions(App, { initialView: "sales-enablement" }, [
    (nodes) => nodes.find(({ props }) => props.session?.activeStepId === "scope")
      .props.onExit(),
  ]);
  assert.match(markup, /Select company context/);
  assert.match(markup, /aria-label="Content workflow"/);
  assert.doesNotMatch(markup, /data-sales-enablement-workspace/);
});

test("company switching remains available outside the dedicated Sales workspace", async () => {
  const { App } = await vite.ssrLoadModule("/src/App.jsx");
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
  assert.match(markup, /class="content-library writing-main"/);
  assert.match(markup, /aria-label="Sales enablement workflow" class="writing-sidebar"/);
  assert.doesNotMatch(markup, /class="sales-steps"|class="sales-enablement-header"/);
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

test("the App sidebar renders the five Sales stages in the Blog workflow anatomy", async () => {
  const { AppSidebar } = await vite.ssrLoadModule("/src/components/AppSidebar.jsx");
  const { COMPANY_CATALOG } = await vite.ssrLoadModule("/src/data/companyCatalog.js");
  const { createSalesEnablementSession } = await vite.ssrLoadModule("/src/data/salesEnablementSession.js");
  const retell = COMPANY_CATALOG.find(({ id }) => id === "retell");
  const markup = render(AppSidebar, {
    activeView: "sales-enablement", company: retell, onViewChange() {},
    onSalesEnablementStepChange() {}, salesEnablementSession: createSalesEnablementSession(),
  });
  for (const phase of ["01 BRIEF IT", "02 BUILD IT", "03 REVIEW IT"]) {
    assert.ok(markup.includes(phase), phase);
  }
  for (const label of ["Define scope", "Gather evidence", "Build narrative", "Generate deck", "Validate readiness"]) {
    assert.equal(markup.split(label).length - 1, 1, label);
  }
  assert.match(markup, /aria-label="Sales enablement workflow" class="writing-sidebar"/);
  assert.equal((markup.match(/aria-current="step"/g) ?? []).length, 1);
  assert.equal((markup.match(/data-state="completed"/g) ?? []).length, 4);
});

test("the scope screen uses the Blog page, form, and action anatomy", async () => {
  const { SalesEnablementWorkspace, session } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, {
    session, dispatch() {}, onExit() {}, onRunLive() {},
  });
  assert.match(markup, /class="writing-workspace"/);
  assert.match(markup, /class="writing-page"/);
  assert.match(markup, /class="writing-page-header"/);
  assert.match(markup, /<h1[^>]*id="sales-stage-scope"[^>]*tabindex="-1"[^>]*>Define scope<\/h1>/);
  assert.match(markup, /class="sales-scope-form writing-form"/);
  assert.equal((markup.match(/class="sales-field writing-field"/g) ?? []).length, 8);
  assert.match(markup, /class="writing-actions"[\s\S]*Example run[\s\S]*Run live/);
  assert.match(markup, /Move an AI voice-agent workflow/);
  assert.doesNotMatch(markup, /Situation-Specific, Not Generic|Sales Uses What Sales Trusts/);
  assert.doesNotMatch(markup, /sales-enablement-header|sales-steps/);
});

test("non-scope steps show their manifest overview", async () => {
  const { SalesEnablementWorkspace, session } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, {
    session: { ...session, activeStepId: "research" }, dispatch() {}, onExit() {},
  });
  assert.match(markup, /<h1[^>]*id="sales-stage-research"[^>]*>Gather evidence<\/h1>/);
  assert.match(markup, /Route Retell context across seven focused research workstreams./);
  assert.doesNotMatch(markup, /name="sellerName"/);
});

test("pending Sales stages use the Blog sidebar locked state", async () => {
  const { AppSidebar } = await vite.ssrLoadModule("/src/components/AppSidebar.jsx");
  const { COMPANY_CATALOG } = await vite.ssrLoadModule("/src/data/companyCatalog.js");
  const { createSalesEnablementSession } = await vite.ssrLoadModule("/src/data/salesEnablementSession.js");
  const session = createSalesEnablementSession();
  session.mode = "live";
  session.run = {
    ...session.run, id: "resp_pending123", status: "queued", stageId: "scope", artifact: null,
    stages: [
      { id: "scope", status: "active" },
      ...["research", "narrative", "asset", "review"].map((id) => ({ id, status: "pending" })),
    ],
  };
  const markup = render(AppSidebar, {
    activeView: "sales-enablement",
    company: COMPANY_CATALOG.find(({ id }) => id === "retell"),
    onViewChange() {}, onSalesEnablementStepChange() {}, salesEnablementSession: session,
  });
  assert.equal((markup.match(/data-state="locked"/g) ?? []).length, 4);
  assert.equal((markup.match(/disabled=""/g) ?? []).length, 4);
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

test("UI-edited objection lines prepare a valid request without changing the form or other wire fields", async (t) => {
  const { SalesEnablementScopeStep } = await vite.ssrLoadModule(
    "/src/components/sales-enablement/SalesEnablementScopeStep.jsx");
  const { validateSalesEnablementInput } = await vite.ssrLoadModule("/src/data/salesEnablementContract.js");
  for (const [edited, expected] of [["", []], ["\n \n", []], ["Cost\n", ["Cost"]],
    ["  Cost  \n\n Operational ownership \n", ["Cost", "Operational ownership"]]]) {
    await t.test(JSON.stringify(edited), async () => {
      const completed = await publicRun();
      let submitted;
      let validated;
      const harness = await lifecycleHarness(async (_url, options) => {
        assert.equal(options.method, "POST");
        submitted = JSON.parse(options.body);
        validated = validateSalesEnablementInput(submitted);
        return response(completed);
      });
      harness.dispatch({ type: "set-input", field: "buyerProblem", value: "  Keep this wording\nand spacing  " });
      const getObjections = () => elements(SalesEnablementScopeStep({ input: harness.session.input,
        dispatch: harness.dispatch })).find((node) => node.type === "textarea" && node.props.name === "knownObjections");
      getObjections().props.onChange({ target: { name: "knownObjections", value: edited } });
      assert.equal(getObjections().props.value, edited);
      const formInput = structuredClone(harness.session.input);
      await harness.lifecycle.runLive(formInput);
      assert.equal(harness.session.run.id, completed.id);
      assert.equal(harness.session.run.status, "completed");
      assert.deepEqual(submitted.knownObjections, expected);
      assert.deepEqual(validated.knownObjections, expected);
      for (const key of Object.keys(formInput).filter((key) => key !== "knownObjections")) {
        assert.equal(submitted[key], formInput[key], key);
      }
      assert.deepEqual(harness.session.input, formInput);
      assert.equal(getObjections().props.value, edited);
    });
  }
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

test("research exposes seven public findings and source-linked evidence", async () => {
  const { SalesEnablementWorkspace, session } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, {
    session: { ...session, activeStepId: "research" }, dispatch() {}, onExit() {},
  });
  for (const label of ["Company and positioning", "Product and technical fit", "Executive buyer",
    "Technical buyer", "Market and alternatives", "Proof and claims", "Skeptical review"]) {
    assert.ok(markup.includes(label), label);
  }
  assert.equal((markup.match(/data-sales-workstream=/g) ?? []).length, 7);
  assert.equal((markup.match(/class="activity-card sales-workstream"/g) ?? []).length, 7);
  assert.match(markup, /class="writing-activity"/);
  assert.match(markup, /class="review-layout"/);
  assert.match(markup, /class="coverage-panel sales-enablement-inspector"/);
  assert.match(markup, /Sources &amp; evidence/);
  assert.match(markup, /Buyer implication/);
  assert.match(markup, /Safe use/);
  assert.doesNotMatch(markup, /multi_agent_call|agent_message|chain.of.thought|reasoning/i);
});

test("narrative renders its arc and all eleven slide rationales", async () => {
  const { SalesEnablementWorkspace, session } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, {
    session: { ...session, activeStepId: "narrative" }, dispatch() {}, onExit() {},
  });
  for (const label of ["Situation", "Complication", "Resolution"]) assert.ok(markup.includes(label));
  assert.equal((markup.match(/data-sales-rationale=/g) ?? []).length, 11);
  assert.match(markup, /Run a bounded pilot with owners/);
});

test("deck renders eleven ordered slides, speaker notes, and explicit proof posture", async () => {
  const { SalesEnablementWorkspace, session } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, {
    session: { ...session, activeStepId: "asset" }, dispatch() {}, onExit() {},
  });
  assert.deepEqual([...markup.matchAll(/data-sales-slide="([^"]+)"/g)].map((m) => m[1]),
    ["slide-1", "slide-2", "slide-3", "slide-4", "slide-5", "slide-6", "slide-7", "slide-8", "slide-9", "slide-10", "slide-11"]);
  for (const label of ["Production exposes the gaps a demo can hide", "Needs evidence", "Company claim",
    "Verified", "Inference", "Speaker notes", "retell-technical-owner"]) assert.ok(markup.includes(label), label);
});

test("review separates passed checks, warnings, blocking gaps, and sources", async () => {
  const { SalesEnablementWorkspace, session } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, {
    session: { ...session, activeStepId: "review" }, dispatch() {}, onExit() {},
  });
  for (const label of ["Readiness checks", "Passed", "Warnings", "Blocking gaps", "Do not overclaim",
    "Sources &amp; evidence", "Verified case-study outcome is not yet selected."]) assert.ok(markup.includes(label), label);
  assert.match(markup, /class="review-layout"/);
  assert.match(markup, /class="coverage-panel sales-enablement-inspector"/);
  assert.doesNotMatch(markup, /Approved collateral/);
});

test("empty and creating live views never display the example artifact", async () => {
  const { SalesEnablementWorkspace, session } = await workspaceModules();
  for (const activeStepId of ["research", "narrative", "asset", "review"]) {
    for (const run of [session.run, { ...session.run, id: "resp_live123456", status: "in_progress", artifact: null }]) {
      const markup = render(SalesEnablementWorkspace, {
        session: { ...session, activeStepId, run, mode: "live", requestStatus: "creating" }, dispatch() {}, onExit() {},
      });
      assert.match(markup, /This view will populate after the run completes/);
      assert.match(markup, /aria-busy="true" inert=""/);
      assert.match(markup, /class="writing-generation-notice sales-run-notice"/);
      assert.doesNotMatch(markup, /Production exposes the gaps a demo can hide|Ready to inspect/);
    }
  }
});

test("request failures and provider wait remain visible on every step", async () => {
  const { SalesEnablementWorkspace, session } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, {
    session: { ...session, mode: "live", error: { message: "Please wait before trying again.", retryAfterSeconds: 12 },
      retryBlocked: true, activeStepId: "asset" }, dispatch() {}, onExit() {},
  });
  assert.match(markup, /role="alert">Please wait before trying again./);
  assert.match(markup, /12 seconds/);
});

async function lifecycleHarness(fetchImpl, sleep, options = {}) {
  const { createSalesEnablementLifecycle } = await vite.ssrLoadModule(
    "/src/components/sales-enablement/useSalesEnablementRuntime.js");
  const { createSalesEnablementSession, salesEnablementReducer, rememberRun, latestActiveRunId } =
    await vite.ssrLoadModule("/src/data/salesEnablementSession.js");
  let session = createSalesEnablementSession();
  const actions = [];
  const values = new Map();
  const storage = options.storage ?? { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const dispatch = (action) => { actions.push(action); session = salesEnablementReducer(session, action); };
  const remount = () => createSalesEnablementLifecycle({ fetchImpl, sleep, storage, dispatch, getSession: () => session });
  const lifecycle = remount();
  return { lifecycle, remount, dispatch, actions, storage, rememberRun, latestActiveRunId, get session() { return session; } };
}
const response = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json", ...headers },
});
async function publicRun(status = "completed", id = "resp_lifecycle123") {
  const { session } = await workspaceModules();
  return { ...structuredClone(session.run), id, status,
    artifact: status === "completed" ? session.run.artifact : null };
}

test("live create remembers only public run metadata and polls with one stable request ID", async () => {
  const queued = await publicRun("queued");
  const completed = await publicRun();
  const calls = [];
  const harness = await lifecycleHarness(async (url, options) => {
    calls.push([url, options]);
    return response(options.method === "POST" ? queued : completed);
  });
  await harness.lifecycle.runLive(harness.session.input);
  assert.deepEqual(calls.map(([url, options]) => [url, options.method ?? "GET"]), [
    ["/api/sales-enablement/runs", "POST"], ["/api/sales-enablement/runs/resp_lifecycle123", "GET"],
  ]);
  assert.deepEqual(harness.actions.map(({ type }) => type), ["live-starting", "live-started", "live-updated"]);
  assert.equal(new Set(harness.actions.map(({ requestId }) => requestId)).size, 1);
  assert.ok(harness.actions[0].requestId);
  assert.equal(harness.session.run.status, "completed");
  assert.equal(harness.session.requestStatus, "idle");
  const saved = harness.storage.getItem("content-lab:sales-enablement-runs:v1");
  assert.doesNotMatch(saved, /artifact|bodyBullets|buyerProblem/);
  assert.equal(harness.latestActiveRunId(harness.storage), null);
});

test("resume ignores corrupt IDs, follows an active run once, and honors polling Retry-After", async () => {
  const queued = await publicRun("queued");
  const completed = await publicRun();
  const waits = [];
  let count = 0;
  const harness = await lifecycleHarness(async () => {
    count += 1;
    return count === 1 ? response(queued) : count === 2 ? response({ error: {
      code: "RATE_LIMITED", message: "Wait before polling.", retryable: true, retryAfterSeconds: 3,
    } }, 429) : response(completed);
  }, async (ms) => { waits.push(ms); });
  harness.storage.setItem("content-lab:sales-enablement-runs:v1", JSON.stringify({ version: 1, runs: [{ id: "../../private", status: "queued" }] }));
  await harness.lifecycle.resume(harness.session.input);
  assert.equal(count, 0);
  harness.rememberRun(harness.storage, queued, harness.session.input);
  const first = harness.lifecycle.resume(harness.session.input);
  await harness.lifecycle.resume({ ...harness.session.input, sellerName: "Edited seller" });
  await first;
  assert.equal(count, 3);
  assert.deepEqual(waits, [3000]);
  assert.equal(harness.session.run.status, "completed");
  assert.equal(new Set(harness.actions.map(({ requestId }) => requestId)).size, 1);
});

test("create failures require an explicit retry after cooldown and each attempt has a new request ID", async (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  let calls = 0;
  const harness = await lifecycleHarness(async () => {
    calls += 1;
    return response({ error: { code: "RATE_LIMITED", message: "Please wait.", retryable: true, retryAfterSeconds: 5 } }, 429);
  });
  await harness.lifecycle.runLive(harness.session.input);
  assert.equal(calls, 1);
  assert.equal(harness.session.retryBlocked, true);
  assert.equal(harness.session.error.retryAfterSeconds, 5);
  const firstId = harness.actions[0].requestId;
  assert.equal(harness.actions[1].requestId, firstId);
  now += 5000;
  harness.dispatch({ type: "retry-ready", requestId: firstId });
  await harness.lifecycle.runLive(harness.session.input);
  assert.equal(calls, 2);
  assert.notEqual(harness.actions.findLast(({ type }) => type === "live-starting").requestId, firstId);
});

test("new requests abort old creates and late completions cannot change state or storage", async () => {
  const oldRun = await publicRun("completed", "resp_oldrequest1");
  const newRun = await publicRun("completed", "resp_newrequest1");
  let resolveOld;
  let firstSignal;
  let calls = 0;
  const harness = await lifecycleHarness(async (_url, options) => {
    calls += 1;
    if (calls === 1) {
      firstSignal = options.signal;
      return new Promise((resolve) => { resolveOld = resolve; });
    }
    return response(newRun);
  });
  const old = harness.lifecycle.runLive(harness.session.input);
  await harness.lifecycle.runLive(harness.session.input);
  assert.equal(firstSignal.aborted, true);
  resolveOld(response(oldRun));
  await old;
  assert.equal(harness.session.run.id, "resp_newrequest1");
  assert.doesNotMatch(harness.storage.getItem("content-lab:sales-enablement-runs:v1"), /resp_oldrequest1/);
  assert.deepEqual(harness.actions.map(({ type }) => type), ["live-starting", "request-cancelled", "live-starting", "live-started"]);
});

test("poll network failures retain a sanitized resumable ID and hide raw exception details", async () => {
  const queued = await publicRun("queued");
  let count = 0;
  const harness = await lifecycleHarness(async () => {
    count += 1;
    if (count === 1) return response(queued);
    throw new Error("raw provider payload and agent_message");
  });
  await harness.lifecycle.runLive(harness.session.input);
  assert.equal(harness.latestActiveRunId(harness.storage), "resp_lifecycle123");
  assert.equal(harness.session.requestStatus, "idle");
  assert.doesNotMatch(harness.session.error.message, /raw provider|agent_message/);
  assert.equal(harness.actions.at(-1).requestId, harness.actions[0].requestId);
});

test("aborting a resume supports effect remount without replaying a create", async () => {
  const queued = await publicRun("queued");
  const completed = await publicRun();
  let resolveOld;
  let count = 0;
  const harness = await lifecycleHarness(async (_url, options) => {
    assert.notEqual(options.method, "POST");
    count += 1;
    if (count === 1) return new Promise((resolve) => { resolveOld = resolve; });
    return response(completed);
  });
  harness.rememberRun(harness.storage, queued, harness.session.input);
  const first = harness.lifecycle.resume(harness.session.input);
  harness.lifecycle.abort();
  await harness.lifecycle.resume(harness.session.input);
  resolveOld(response(queued));
  await first;
  assert.equal(count, 2);
  assert.equal(harness.session.run.status, "completed");
});

test("a mismatched polled run cannot overwrite the active run or remembered index", async () => {
  const queued = await publicRun("queued");
  const unrelated = await publicRun("completed", "resp_unrelated1");
  let calls = 0;
  const harness = await lifecycleHarness(async () => response(++calls === 1 ? queued : unrelated));
  await harness.lifecycle.runLive(harness.session.input);
  assert.equal(harness.session.run.id, "resp_lifecycle123");
  assert.equal(harness.session.requestStatus, "idle");
  assert.match(harness.session.error.message, /could not be reached/);
  assert.equal(harness.latestActiveRunId(harness.storage), "resp_lifecycle123");
  assert.doesNotMatch(harness.storage.getItem("content-lab:sales-enablement-runs:v1"), /resp_unrelated1/);
});

test("exit during create leaves an honest interrupted state and an enabled explicit action on reopen", async () => {
  const completed = await publicRun();
  let resolveCreate;
  let calls = 0;
  const harness = await lifecycleHarness(async () => {
    calls += 1;
    if (calls === 1) return new Promise((resolve) => { resolveCreate = resolve; });
    return response(completed);
  });
  const pending = harness.lifecycle.runLive(harness.session.input);
  const id = harness.session.requestId;
  harness.lifecycle.abort();
  assert.equal(harness.session.requestStatus, "idle");
  assert.equal(harness.actions.at(-1).requestId, id);
  const reopened = harness.remount();
  await reopened.resume(harness.session.input);
  assert.equal(calls, 1);
  const { SalesEnablementWorkspace } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, {
    session: { ...harness.session, provider: { checked: true, configured: true } }, dispatch() {}, onExit() {},
  });
  assert.match(markup, /interrupted/);
  assert.match(markup, /<button(?![^>]*disabled)[^>]*>Run live<\/button>/);
  resolveCreate(response(completed));
  await pending;
  assert.equal(harness.session.requestStatus, "idle");
  await reopened.runLive(harness.session.input);
  assert.equal(calls, 2);
  assert.equal(harness.session.run.status, "completed");
});

test("interrupted polling resumes from retained memory when browser storage is unavailable", async () => {
  const queued = await publicRun("queued");
  const completed = await publicRun();
  let resolvePoll;
  const calls = [];
  const harness = await lifecycleHarness(async (url, options) => {
    calls.push([url, options.method ?? "GET"]);
    if (calls.length === 1) return response(queued);
    if (calls.length === 2) return new Promise((resolve) => { resolvePoll = resolve; });
    return response(completed);
  }, undefined, { storage: { getItem() { throw new Error("denied"); }, setItem() { throw new Error("denied"); } } });
  const pending = harness.lifecycle.runLive(harness.session.input);
  while (!resolvePoll) await new Promise((resolve) => setImmediate(resolve));
  harness.lifecycle.abort();
  assert.equal(harness.session.requestStatus, "idle");
  await harness.remount().resume(harness.session.input);
  assert.equal(harness.session.run.status, "completed");
  assert.deepEqual(calls.map((call) => call[1]), ["POST", "GET", "GET"]);
  assert.equal(calls[2][0], "/api/sales-enablement/runs/resp_lifecycle123");
  resolvePoll(response(queued));
  await pending;
  assert.equal(harness.session.run.status, "completed");
});

test("Example keeps provider cooldown visible and blocks creates across remount until its deadline", async (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  let calls = 0;
  const harness = await lifecycleHarness(async () => {
    calls += 1;
    return response({ error: { code: "RATE_LIMITED", message: "Wait.", retryable: true, retryAfterSeconds: 30 } }, 429);
  });
  await harness.lifecycle.runLive(harness.session.input);
  harness.lifecycle.showExample();
  const reopened = harness.remount();
  now = 11000;
  await reopened.runLive(harness.session.input);
  assert.equal(calls, 1);
  const { SalesEnablementWorkspace } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, {
    session: { ...harness.session, provider: { checked: true, configured: true } }, dispatch() {}, onExit() {},
  });
  assert.equal(harness.session.mode, "example");
  assert.match(markup, /<strong>Example run<\/strong>/);
  assert.match(markup, /20 seconds/);
  assert.match(markup, /<button[^>]*disabled[^>]*>Run live<\/button>/);
  now = 31000;
  harness.dispatch({ type: "retry-ready", requestId: harness.session.cooldown.requestId });
  assert.equal(harness.session.retryBlocked, false);
  const readyMarkup = render(SalesEnablementWorkspace, {
    session: { ...harness.session, provider: { checked: true, configured: true } }, dispatch() {}, onExit() {},
  });
  assert.match(readyMarkup, /<button(?![^>]*disabled)[^>]*>Run live<\/button>/);
  await reopened.runLive(harness.session.input);
  assert.equal(calls, 2);
});

test("Example during a polling wait retains the absolute cooldown until an explicit create after expiry", async (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  const queued = await publicRun("queued");
  const completed = await publicRun();
  const calls = [];
  let waiting;
  const waitStarted = new Promise((resolve) => { waiting = resolve; });
  const harness = await lifecycleHarness(async (url, options) => {
    calls.push([url, options.method ?? "GET"]);
    if (calls.length === 1) return response(queued);
    if (calls.length === 2) return response({ error: {
      code: "RATE_LIMITED", message: "PRIVATE_POLL_ERROR", retryable: true, retryAfterSeconds: 10,
    } }, 429);
    return response(completed);
  }, (_ms, signal) => new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    waiting();
  }));
  const pending = harness.lifecycle.runLive(harness.session.input);
  t.after(async () => { harness.lifecycle.abort(); await pending; });
  await waitStarted;
  assert.deepEqual(harness.session.cooldown, { until: 11000, requestId: harness.session.requestId });
  assert.equal(harness.session.requestStatus, "polling");
  assert.doesNotMatch(JSON.stringify(harness.session), /PRIVATE_POLL_ERROR/);
  const cooldown = harness.session.cooldown;
  harness.lifecycle.showExample();
  await pending;
  assert.equal(harness.session.mode, "example");
  assert.equal(harness.session.requestStatus, "idle");
  assert.equal(harness.session.activeRun.id, "resp_lifecycle123");
  now = 7000;
  await harness.lifecycle.runLive(harness.session.input);
  await harness.lifecycle.releaseCooldown(cooldown);
  assert.equal(calls.length, 2);
  const { SalesEnablementWorkspace } = await workspaceModules();
  const props = () => ({ session: { ...harness.session, activeStepId: "scope",
    provider: { checked: true, configured: true } }, dispatch() {}, onExit() {} });
  const markup = render(SalesEnablementWorkspace, props());
  assert.match(markup, /4 seconds/);
  assert.match(markup, /<button[^>]*disabled[^>]*>Run live<\/button>/);
  now = 11000;
  await harness.lifecycle.releaseCooldown(cooldown);
  await harness.lifecycle.resume(harness.session.input);
  assert.equal(calls.length, 2);
  assert.equal(harness.session.mode, "example");
  assert.equal(harness.session.retryBlocked, false);
  assert.match(render(SalesEnablementWorkspace, props()), /<button(?![^>]*disabled)[^>]*>Run live<\/button>/);
  await harness.lifecycle.runLive(harness.session.input);
  assert.deepEqual(calls.map((call) => call[1]), ["POST", "GET", "POST"]);
});

test("cooldown expiry re-enables the live failure view even while its error message remains", async (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  const harness = await lifecycleHarness(async () => response({ error: {
    code: "RATE_LIMITED", message: "Wait before retrying.", retryable: true, retryAfterSeconds: 5,
  } }, 429));
  await harness.lifecycle.runLive(harness.session.input);
  now += 5000;
  harness.dispatch({ type: "retry-ready", requestId: harness.session.cooldown.requestId });
  const { SalesEnablementWorkspace } = await workspaceModules();
  const markup = render(SalesEnablementWorkspace, {
    session: { ...harness.session, provider: { checked: true, configured: true } }, dispatch() {}, onExit() {},
  });
  assert.match(markup, /<button(?![^>]*disabled)[^>]*>Run live<\/button>/);
  assert.doesNotMatch(markup, /5 seconds/);
});

test("explicit Example suppresses delayed automatic resume for this visit but a remount can resume", async () => {
  const queued = await publicRun("queued");
  const completed = await publicRun();
  let calls = 0;
  const harness = await lifecycleHarness(async () => { calls += 1; return response(completed); });
  harness.rememberRun(harness.storage, queued, harness.session.input);
  harness.lifecycle.showExample();
  harness.dispatch({ type: "provider-health", provider: { configured: true, model: "gpt-5.6-sol" } });
  await harness.lifecycle.resume(harness.session.input);
  // Effect cleanup must not erase an explicit choice made during this visit.
  harness.lifecycle.abort();
  await harness.lifecycle.resume(harness.session.input);
  assert.equal(calls, 0);
  assert.equal(harness.session.mode, "example");
  await harness.remount().resume(harness.session.input);
  assert.equal(calls, 1);
  assert.equal(harness.session.mode, "live");
  assert.equal(harness.session.run.status, "completed");
});

test("a reopened active run resumes its retained ID when cooldown expires without navigation", async (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  const queued = await publicRun("queued");
  const completed = await publicRun();
  const calls = [];
  const harness = await lifecycleHarness(async (url, options) => {
    calls.push([url, options.method ?? "GET"]);
    return calls.length === 1 ? response({ error: {
      code: "RATE_LIMITED", message: "Wait before retrieving.", retryable: true, retryAfterSeconds: 10,
    } }, 429) : response(completed);
  });
  harness.rememberRun(harness.storage, queued, harness.session.input);
  await harness.lifecycle.resume(harness.session.input);
  const cooldown = harness.session.cooldown;
  harness.lifecycle.abort();
  const reopened = harness.remount();
  await reopened.resume(harness.session.input);
  assert.equal(calls.length, 1);
  assert.equal(harness.latestActiveRunId(harness.storage), "resp_lifecycle123");
  now = 10999;
  await reopened.releaseCooldown(cooldown);
  assert.equal(calls.length, 1);
  now = 11000;
  await reopened.releaseCooldown(cooldown);
  assert.deepEqual(calls, [
    ["/api/sales-enablement/runs/resp_lifecycle123", "GET"],
    ["/api/sales-enablement/runs/resp_lifecycle123", "GET"],
  ]);
  assert.equal(harness.session.run.status, "completed");
  assert.equal(harness.session.retryBlocked, false);
  assert.equal(harness.session.requestStatus, "idle");
  assert.equal(harness.actions.find(({ type }) => type === "retry-ready").requestId, cooldown.requestId);
  await reopened.releaseCooldown(cooldown);
  assert.equal(calls.length, 2);
});

test("Example selection cancels a deferred resume but preserves its active ID", async (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  const queued = await publicRun("queued");
  let calls = 0;
  const harness = await lifecycleHarness(async () => {
    calls += 1;
    return response({ error: { code: "RATE_LIMITED", message: "Wait.", retryable: true, retryAfterSeconds: 10 } }, 429);
  });
  harness.rememberRun(harness.storage, queued, harness.session.input);
  await harness.lifecycle.resume(harness.session.input);
  const cooldown = harness.session.cooldown;
  const reopened = harness.remount();
  await reopened.resume(harness.session.input);
  reopened.showExample();
  now = 11000;
  await reopened.releaseCooldown(cooldown);
  assert.equal(calls, 1);
  assert.equal(harness.session.mode, "example");
  assert.equal(harness.session.retryBlocked, false);
  assert.equal(harness.latestActiveRunId(harness.storage), "resp_lifecycle123");
});

test("cooldown expiry neither replays a create nor interrupts unrelated active work", async (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  const queued = await publicRun("queued");
  const completed = await publicRun("completed", "resp_newrequest1");
  let resolveCreate;
  let createSignal;
  const calls = [];
  const harness = await lifecycleHarness(async (url, options) => {
    calls.push([url, options.method ?? "GET"]);
    if (calls.length === 1) return response({ error: {
      code: "RATE_LIMITED", message: "Wait.", retryable: true, retryAfterSeconds: 10,
    } }, 429);
    createSignal = options.signal;
    return new Promise((resolve) => { resolveCreate = resolve; });
  });
  harness.rememberRun(harness.storage, queued, harness.session.input);
  await harness.lifecycle.resume(harness.session.input);
  const cooldown = harness.session.cooldown;
  const reopened = harness.remount();
  await reopened.resume(harness.session.input);
  now = 11000;
  const creating = reopened.runLive(harness.session.input);
  const creatingId = harness.session.requestId;
  await reopened.releaseCooldown(cooldown);
  assert.equal(calls.length, 2);
  assert.equal(createSignal.aborted, false);
  assert.equal(harness.session.requestId, creatingId);
  assert.equal(harness.session.requestStatus, "creating");
  resolveCreate(response(completed));
  await creating;
  assert.deepEqual(calls.map((call) => call[1]), ["GET", "POST"]);
  assert.equal(harness.session.run.id, "resp_newrequest1");
});
