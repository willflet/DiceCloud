import store from '/imports/client/ui/vuexStore';

if (window) {
  window.onpopstate = function (event) {
    const state = (event && event.state) || {};
    const openDialogs = Number.isFinite(state.openDialogs) ? state.openDialogs : 0;
    // @ts-expect-error store modules don't have types
    const numDialogs = store.state?.dialogStack.dialogs.length;
    if (numDialogs > openDialogs) {
      (window as any).__dialogHistoryPop = true;
      const dialogsToPop = numDialogs - openDialogs;
      for (let i = 0; i < dialogsToPop; i++) {
        // @ts-expect-error store modules don't have types
        store.commit('popDialogStackMutation', store.state.dialogStack.currentResult);
      }
      (window as any).__dialogHistoryPop = false;
    }
  };
}