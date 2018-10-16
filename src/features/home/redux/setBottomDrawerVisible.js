// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
import { storage } from '../../common/utils';
import { HOME_SET_BOTTOM_DRAWER_VISIBLE } from './constants';

export function setBottomDrawerVisible(visible) {
  storage.local.setItem('bottomDrawerVisible', visible);

  return {
    type: HOME_SET_BOTTOM_DRAWER_VISIBLE,
    payload: { visible },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SET_BOTTOM_DRAWER_VISIBLE:
      if (state.bottomDrawerVisible !== action.payload.visible)
        requestAnimationFrame(() => window.dispatchEvent(new window.Event('resize')));
      return {
        ...state,
        bottomDrawerVisible: action.payload.visible,
      };

    default:
      return state;
  }
}
