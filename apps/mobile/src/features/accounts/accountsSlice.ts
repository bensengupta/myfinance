import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uniqBy } from 'lodash';

export interface AccountsState {
  budgetAccounts: { name: string }[];
}

const initialState: AccountsState = {
  budgetAccounts: [
    { name: '💵 Chequing' },
    { name: '💰 Savings' },
    { name: '💳 Credit Card' },
  ],
};

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: (state, action: PayloadAction<string>) => {
      state.budgetAccounts = uniqBy(
        [...state.budgetAccounts, { name: action.payload }],
        'name'
      );
    },
    renameAccount(state, action: PayloadAction<{ old: string; new: string }>) {
      const index = state.budgetAccounts.findIndex(
        (acct) => acct.name === action.payload.old
      );
      if (index !== -1) {
        state.budgetAccounts[index].name = action.payload.new;
      }
    },
    removeAccount: (state, action: PayloadAction<string>) => {
      state.budgetAccounts = state.budgetAccounts.filter(
        (acct) => acct.name !== action.payload
      );
    },
  },
});

export const { addAccount, renameAccount, removeAccount } =
  accountsSlice.actions;

export default accountsSlice.reducer;
