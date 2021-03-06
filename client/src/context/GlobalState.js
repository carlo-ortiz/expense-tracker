import React, { createContext, useReducer } from 'react';
import axios from 'axios';

import AppReducer from './AppReducer';
import * as Constants from '../constants/Constants';

//Initial State
const initialState = {
  transactions: [],
  error: null,
  loading: true,
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  //ACTION
  async function getTransactions() {
    try {
      const response = await axios.get('/api/v1/transactions');
      dispatch({
        type: Constants.GET_TRANSACTIONS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: Constants.TRANSACTION_ERROR,
        payload: error.response.data.error,
      });
    }
  }

  async function deleteTransaction(id) {
    try {
      await axios.delete(`/api/v1/transactions/${id}`);
    } catch (error) {
      dispatch({
        type: Constants.TRANSACTION_ERROR,
        payload: error.response.data.error,
      });
    }

    dispatch({
      type: Constants.DELETE_TRANSACTION,
      payload: id,
    });
  }

  async function addTransaction(transaction) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        'api/v1/transactions',
        transaction,
        config
      );

      dispatch({
        type: Constants.ADD_TRANSACTION,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: Constants.TRANSACTION_ERROR,
        payload: error.response.data.error,
      });
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        deleteTransaction,
        loading: state.loading,
        error: state.error,
        addTransaction,
        getTransactions,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};
