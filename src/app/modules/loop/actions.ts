import types, { CharmPayload } from './types';
import { LoopOutArguments, LoopInArguments } from 'lib/loop-http/types';
import { selectSyncedLoopState, selectSyncedCharmState } from './selectors';
import LoopHttpClient from 'lib/loop-http';

export function setLoop(url: string, loopMacaroon: string) {
  return { type: types.SET_LOOP_URL, payload: { url, loopMacaroon } };
}

export function getLoopOutTerms() {
  return { type: types.GET_LOOP_OUT_TERMS };
}

export function getLoopInTerms() {
  return { type: types.GET_LOOP_IN_TERMS };
}

export function getLoopOutQuote(amount: string | number, confTarget?: string | number) {
  return { type: types.GET_LOOP_OUT_QUOTE, payload: { amount, confTarget } };
}

export function getLoopInQuote(amount: string | number, confTarget?: string | number) {
  return { type: types.GET_LOOP_IN_QUOTE, payload: { amount, confTarget } };
}

export function loopOut(payload: LoopOutArguments) {
  return { type: types.LOOP_OUT, payload };
}

export function loopIn(payload: LoopInArguments) {
  return { type: types.LOOP_IN, payload };
}

export function listSwaps() {
  return { type: types.LIST_SWAPS };
}

export function resetLoop() {
  return { type: types.RESET_LOOP };
}

// CHARM actions
export function activateCharm(charm: CharmPayload) {
  return { type: types.ACTIVATE_CHARM, payload: charm };
}

export function deactivateCharm() {
  return { type: types.DEACTIVATE_CHARM };
}

export function setSyncedLoopState(payload: ReturnType<typeof selectSyncedLoopState>) {
  const { url, loopMacaroon } = payload;
  return {
    type: types.SYNC_LOOP_STATE,
    payload: {
      url,
      loopMacaroon,
      lib: url ? new LoopHttpClient(url as string, loopMacaroon as string) : null,
    },
  };
}

export function setSyncedCharmState(payload: ReturnType<typeof selectSyncedCharmState>) {
  return {
    type: types.SYNC_CHARM_STATE,
    payload,
  };
}
