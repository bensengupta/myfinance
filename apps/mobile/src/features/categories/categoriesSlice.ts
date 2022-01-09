import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uniqBy } from 'lodash';

export interface Category {
  name: string;
  group?: string;
}

export interface CategoriesState {
  categories: Category[];
  groups: { name: string }[];
}

const initialState: CategoriesState = {
  categories: [
    { name: '🛒 Groceries', group: 'Expenses' },
    { name: '🍴 Eating Out', group: 'Expenses' },
    { name: '🎉 Fun Money', group: 'Expenses' },
    { name: '🧻 Toiletries / Supplies', group: 'Expenses' },
    { name: '✔️ Everything Else', group: 'Expenses' },
    { name: '🚌 Transportation', group: 'Expenses' },
    { name: '🏠 Rent', group: 'Monthly Bills' },
    { name: '📱 Cell Phone Bill', group: 'Monthly Bills' },
    { name: '👕 Clothing', group: 'Long-term Funds' },
    { name: '🎁 Gifts', group: 'Long-term Funds' },
    { name: 'ℹ️ Available to budget' },
  ],
  groups: [
    { name: 'Expenses' },
    { name: 'Monthly Bills' },
    { name: 'Long-term Funds' },
  ],
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (
      state,
      action: PayloadAction<{ name: string; group?: string }>
    ) => {
      const { name, group } = action.payload;
      state.categories = uniqBy([...state.categories, { name, group }], 'name');
    },
    addGroup: (state, action: PayloadAction<{ name: string }>) => {
      const { name } = action.payload;
      state.groups = uniqBy([...state.groups, { name }], 'name');
    },
    renameCategory(state, action: PayloadAction<{ old: string; new: string }>) {
      const index = state.categories.findIndex(
        (acct) => acct.name === action.payload.old
      );
      if (index !== -1) {
        state.categories[index].name = action.payload.new;
      }
    },
    changeCategoryGroup(
      state,
      action: PayloadAction<{ category: string; newGroup?: string }>
    ) {
      const { category, newGroup } = action.payload;
      const index = state.categories.findIndex(
        (acct) => acct.name === category
      );
      if (index !== -1) {
        state.categories[index].group = newGroup;
      }
    },
    renameGroup(state, action: PayloadAction<{ old: string; new: string }>) {
      const index = state.groups.findIndex(
        (acct) => acct.name === action.payload.old
      );
      if (index !== -1) {
        state.groups[index].name = action.payload.new;
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(
        (acct) => acct.name !== action.payload
      );
    },
    removeGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(
        (acct) => acct.name !== action.payload
      );
    },
  },
});

export const {
  addCategory,
  addGroup,
  renameCategory,
  changeCategoryGroup,
  renameGroup,
  removeGroup,
  removeCategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
