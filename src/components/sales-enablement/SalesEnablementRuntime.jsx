import { useCallback } from "react";
import { SalesEnablementWorkspace } from "./SalesEnablementWorkspace.jsx";
import { useSalesEnablementRuntime } from "./useSalesEnablementRuntime.js";

export function SalesEnablementRuntime({ session, dispatch, onExit }) {
  const { runLive, abort, showExample } = useSalesEnablementRuntime({ session, dispatch });
  const workspaceDispatch = useCallback((action) => {
    if (action.type === "show-example") return showExample();
    dispatch(action);
  }, [showExample, dispatch]);
  return <SalesEnablementWorkspace session={session} dispatch={workspaceDispatch}
    onExit={() => { abort(); onExit(); }} onRunLive={runLive} />;
}
