import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import store from '../../app/store';

export interface Transaction {
  id: string;
  date: string; // ISO 8601 date string
  debit: number;
  credit: number;
  account: string;
  category: string;
  comment?: string;
}

export interface TransactionsState {
  transactions: Transaction[];
}

const initialState: TransactionsState = {
  transactions: [
    {
      id: '0',
      date: '2022-01-08T23:06:42.100Z',
      debit: 7.84,
      credit: 0,
      account: '💵 Chequing',
      category: '🍴 Eating Out',
      comment: 'Pizza',
    },
    {
      id: '1',
      date: '2022-01-04T23:06:42.100Z',
      debit: 40.89,
      credit: 0,
      account: '💳 Credit Card',
      category: '🛒 Groceries',
    },
    {
      id: '2',
      date: '2022-01-03T23:06:42.100Z',
      debit: 0,
      credit: 250,
      account: '💰 Savings',
      category: 'ℹ️ Available to budget',
    },
  ],
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    seedTransactions: (
      state,
      action: PayloadAction<{ accounts: string[]; categories: string[] }>
    ) => {
      const { accounts, categories } = action.payload;
      for (let i = 0; i < 100; i++) {
        state.transactions.push({
          id: nanoid(),
          date: '2022-01-01T23:06:42.100Z',
          debit: Math.random() * 100,
          credit: Math.random() * 80,
          account: accounts[Math.floor(Math.random() * accounts.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
        });
      }
    },
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id'>>) => {
      state.transactions.push({ id: nanoid(), ...action.payload });

      // Resort chronologically
      state.transactions = state.transactions.sort((a, b) =>
        a.date.localeCompare(b.date)
      );
    },
    modifyTransaction: (state, action: PayloadAction<Transaction>) => {
      const { id, ...modifiedTransaction } = action.payload;

      const index = state.transactions.findIndex(
        (transaction) => transaction.id === action.payload.id
      );

      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          ...modifiedTransaction,
        };
      }

      // Resort chronologically
      state.transactions = state.transactions.sort((a, b) =>
        a.date.localeCompare(b.date)
      );
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload
      );
    },
  },
});

export const {
  addTransaction,
  modifyTransaction,
  removeTransaction,
  seedTransactions,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
