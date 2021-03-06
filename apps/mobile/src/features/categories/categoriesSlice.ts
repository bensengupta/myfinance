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
    { name: '๐ Groceries', group: 'Expenses' },
    { name: '๐ด Eating Out', group: 'Expenses' },
    { name: '๐ Fun Money', group: 'Expenses' },
    { name: '๐งป Toiletries / Supplies', group: 'Expenses' },
    { name: 'โ๏ธ Everything Else', group: 'Expenses' },
    { name: '๐ Transportation', group: 'Expenses' },
    { name: '๐  Rent', group: 'Monthly Bills' },
    { name: '๐ฑ Cell Phone Bill', group: 'Monthly Bills' },
    { name: '๐ Clothing', group: 'Long-term Funds' },
    { name: '๐ Gifts', group: 'Long-term Funds' },
    { name: 'โน๏ธ Available to budget' },
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
