import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  orders: [],
  loading: false,
  purchased: false,
  error: null
};

const purchaseInit = (state, action) =>
  updateObject(state, { purchased: false });

const purchaseBurgerSuccess = (state, action) => {
  const newOrder = updateObject(action.orderData, { id: action.orderId });
  return updateObject(state, {
    loading: false,
    purchased: true,
    orders: state.orders.concat(newOrder)
  });
};

const purchaseBurgerFail = (state, action) =>
  updateObject(state, { loading: false });

const purchaseBurgerStart = (state, action) =>
  updateObject(state, { loading: true });

const fetchOrdersStart = (state, action) =>
  updateObject(state, { loading: true });

const fetchOrdersSuccess = (state, action) =>
  updateObject(state, { loading: false, orders: action.orders, error: null });

const fetchOrdersFail = (state, action) =>
  updateObject(state, { loading: false, error: action.error });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT:
      return purchaseInit(state, action);
    //   return {
    //     ...state,
    //     purchased: false
    //   };

    case actionTypes.PURCHASE_BURGER_SUCCESS:
      return purchaseBurgerSuccess(state, action);
    //   const newOrder = {
    //     ...action.orderData,
    //     id: action.orderId
    //   };

    //   return {
    //     ...state,
    // loading: false,
    // purchased: true,
    // orders: state.orders.concat(newOrder)
    //   };

    case actionTypes.PURCHASE_BURGER_FAIL:
      return purchaseBurgerFail(state, action);
    //   return {
    //     ...state,
    //     loading: false
    //   };

    case actionTypes.PURCHASE_BURGER_START:
      return purchaseBurgerStart(state, action);
    //   return {
    //     ...state,
    //     loading: true
    //   };

    case actionTypes.FETCH_ORDERS_START:
      return fetchOrdersStart(state, action);
    //   return {
    //     ...state,
    //     loading: true
    //   };

    case actionTypes.FETCH_ORDERS_SUCCESS:
      return fetchOrdersSuccess(state, action);
    //   return {
    //     ...state,
    //     loading: false,
    //     orders: action.orders
    //};

    case actionTypes.FETCH_ORDERS_FAIL:
      return fetchOrdersFail(state, action);
    //   return {
    //     ...state,
    //     loading: false
    //   };

    default:
      return state;
  }
};

export default reducer;
