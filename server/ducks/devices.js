/* eslint new-cap:0, no-console:0 */
/* globals setTimeout */
import { HueApi, lightState } from 'node-hue-api';

import { config } from 'environment';
import { handleAction,
         registerAccessories,
         flashColor,
         rain,
         setResponse,
         toggleLights } from 'utils';
import { DESK_LIGHT_STRIP_PRIMARY,
         DESK_LIGHT_STRIP_PRIMARY_LENGTH,
         DEADBOLT_LED,
         DEADBOLT_PUSH_BUTTON,
         BUTTON_PRESS_TIMEOUT,
         GREEN } from 'constants';

export const EMIT_REGISTER_DESK_ACCESSORIES = 'EMIT_REGISTER_DESK_ACCESSORIES';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';

export const EMIT_LR_LIGHT_ON = 'EMIT_LR_LIGHT_ON';
export const EMIT_LR_LIGHT_OFF = 'EMIT_LR_LIGHT_OFF';
export const EMIT_LR_LIGHT_TOGGLE = 'EMIT_LR_LIGHT_TOGGLE';
export const EMIT_DR_LIGHT_ON = 'EMIT_DR_LIGHT_ON';
export const EMIT_DR_LIGHT_OFF = 'EMIT_DR_LIGHT_OFF';
export const EMIT_DR_LIGHT_TOGGLE = 'EMIT_DR_LIGHT_TOGGLE';

export const EMIT_DESK_MIC_VALUE_CHANGE = 'EMIT_MIC_VALUE_CHANGE';
export const EMIT_BUZZ = 'EMIT_BUZZ';
export const EMIT_BUZZ_RESPONSE = 'EMIT_BUZZ_RESPONSE';

export const EMIT_PC_ON = 'EMIT_PC_ON';
export const EMIT_PC_RESPONSE = 'EMIT_PC_RESPONSE';

export const EMIT_SOUND_COM = 'EMIT_SOUND_COM';
export const EMIT_SOUND_COM_RESPONSE = 'EMIT_SOUND_COM_RESPONSE';

export const EMIT_REGISTER_DEADBOLT_ACCESSORIES = 'EMIT_REGISTER_DEADBOLT_ACCESSORIES';
export const EMIT_DEADBOLT_PUSH_BUTTON_PRESS = 'EMIT_DEADBOLT_PUSH_BUTTON_PRESS';
export const EMIT_DEADBOLT_SENSOR_CHANGE = 'EMIT_DEADBOLT_SENSOR_CHANGE';

const initialState = {
  ports: config.ports,
  lightState,
  hueUserId: config.users[Object.keys(config.users)[0]],
  isDeadboltLocked: false,
  isDoorClosed: false
};

const devicesReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_REGISTER_DESK_ACCESSORIES]() {
      const newState = registerAccessories(state, action.accessories);

      rain.start(newState[DESK_LIGHT_STRIP_PRIMARY], DESK_LIGHT_STRIP_PRIMARY_LENGTH);

      return newState;
    },

    [EMIT_REGISTER_DEADBOLT_ACCESSORIES]() {
      return registerAccessories(state, action.accessories);
    },

    [EMIT_REGISTER_BRIDGE]() {
      return {
        ...state,
        hueBridge: new HueApi(action.bridge.ipaddress, state.hueUserId)
      };
    },

    [EMIT_DR_LIGHT_ON]() {
      state.hueBridge.setLightState(1, state.lightState.create().on());

      return state;
    },

    [EMIT_DR_LIGHT_OFF]() {
      state.hueBridge.setLightState(1, state.lightState.create().off());

      return state;
    },

    [EMIT_LR_LIGHT_ON]() {
      state.hueBridge.setLightState(2, state.lightState.create().on());

      return state;
    },

    [EMIT_LR_LIGHT_OFF]() {
      state.hueBridge.setLightState(2, state.lightState.create().off());

      return state;
    },

    [EMIT_DR_LIGHT_TOGGLE]() {
      toggleLights(state, 1);
    },

    [EMIT_LR_LIGHT_TOGGLE]() {
      toggleLights(state, 2);
    },

    [EMIT_BUZZ]() {
      flashColor(state[DESK_LIGHT_STRIP_PRIMARY], GREEN, () => {
        rain.start(state[DESK_LIGHT_STRIP_PRIMARY], DESK_LIGHT_STRIP_PRIMARY_LENGTH)
      });
    },

    [EMIT_DEADBOLT_SENSOR_CHANGE]() {
      if (action.value) {
        state.hueBridge.setLightState(2, state.lightState.on());
        setTimeout(() => state.hueBridge.setLightState(1, state.lightState.on()), 3000);

        state[DEADBOLT_LED].fadeIn();
        setTimeout(() => state[DEADBOLT_LED].fadeOut(), 500);
      }

      return reducers[EMIT_DR_LIGHT_ON]();
    },

    [EMIT_DEADBOLT_PUSH_BUTTON_PRESS]() {
      if (!state[DEADBOLT_PUSH_BUTTON]) {
        console.log('Deadbolt device is disconnected');
        return;
      }

      const isAuthorized = action.passcode === config.id;

      if (isAuthorized) {
        state[DEADBOLT_PUSH_BUTTON].high();

        setTimeout(() => {
          state[DEADBOLT_PUSH_BUTTON].low();
        }, BUTTON_PRESS_TIMEOUT);

        setResponse(200);
      } else {
        setResponse(401);
      }

      return state;
    }
  };

  return handleAction(state, action, reducers);
};

export default devicesReducer;
