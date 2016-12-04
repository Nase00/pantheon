/* eslint new-cap:0, no-console:0 */

import { handleAction } from 'utils';

export const FETCH_UNIFIED_ID = 'FETCH_UNIFIED_ID';
export const EMIT_REGISTER_UNIFIED_ID = 'EMIT_REGISTER_UNIFIED_ID';

export const SEND_UNIFIED_COMMAND = 'SEND_UNIFIED_COMMAND';

const initialState = {};

const unifiedReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_REGISTER_UNIFIED_ID]() {
      return {
        ...state,
        unifiedID: action.unifiedID
      };
    }
  };

  return handleAction(state, action, reducers);
};

export default unifiedReducer;
