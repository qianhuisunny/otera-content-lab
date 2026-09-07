import { useCallback } from "react";
import { SalesEnablementWorkspace } from "./SalesEnablementWorkspace.jsx";
import { useSalesEnablementRuntime } from "./useSalesEnablementRuntime.js";

export function SalesEnablementRuntime({ session, dispatch, onExit }) {
  const { runLive, abort } = useSalesEnablementRuntime({ session, dispatch });
  const workspaceDispatch = useCallback((action) => {
    if (action.type === "show-example") abort();
    dispatch(action);
  }, [abort, dispatch]);
  return <SalesEnablementWorkspace session={session} dispatch={workspaceDispatch}
    onExit={() => { abort(); onExit(); }} onRunLive={runLive} />;
}
