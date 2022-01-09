import React, { useEffect } from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import HomeTabsNavigator from './HomeTabs';
import EditTransaction from '../scenes/EditTransaction';
import { useAppDispatch, useAppSelector } from '../app/store';
import { seedTransactions } from '../features/transactions/transactionsSlice';

function Header({ navigation, back, options, route }: NativeStackHeaderProps) {
  const title = options.headerTitle ?? options.title ?? 'MyFinances';
  const { colors } = useTheme();
  return (
    <Appbar.Header theme={{ colors: { primary: colors.surface } }}>
      {back ? (
        <Appbar.BackAction onPress={() => navigation.pop()} />
      ) : undefined}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

export type RootStackParamList = {
  Home: undefined;
  EditTransaction: { id?: string };
};

export type EditTransactionScreenProp = NativeStackScreenProps<
  RootStackParamList,
  'EditTransaction'
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  // Seed transactions
  const dispatch = useAppDispatch();

  const accounts = useAppSelector((state) => state.accounts.budgetAccounts);
  const categories = useAppSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(
      seedTransactions({
        accounts: accounts.map((acct) => acct.name),
        categories: categories.map((cat) => cat.name),
      })
    );
  });
  return (
    <Stack.Navigator screenOptions={{ header: Header }}>
      <Stack.Screen
        name="Home"
        component={HomeTabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditTransaction"
        component={EditTransaction}
        options={({ route }) => ({
          title: route.params?.id ? 'Edit Transaction' : 'New Transaction',
        })}
      />
    </Stack.Navigator>
  );
}
