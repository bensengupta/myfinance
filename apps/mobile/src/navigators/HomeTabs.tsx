import React from 'react';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';

import Dashboard from '../scenes/Dashboard';
import Configure from '../scenes/Configure';
import Transactions from '../scenes/Transactions';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStack';

export type HomeTabsParamList = {
  Dashboard: undefined;
  Configure: undefined;
  Transactions: undefined;
};

export type TransactionsScreenProp = CompositeScreenProps<
  MaterialBottomTabScreenProps<HomeTabsParamList, 'Transactions'>,
  NativeStackScreenProps<RootStackParamList>
>;

const Tab = createMaterialBottomTabNavigator<HomeTabsParamList>();

export default function HomeTabsNavigator() {
  const { dark, colors } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Transactions"
      shifting={false}
      activeColor={colors.primary}
      inactiveColor={colors.disabled}
      barStyle={{
        backgroundColor: colors.surface,
        borderTopWidth: dark ? 0.3 : 0,
        borderColor: colors.disabled,
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Configure') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'Transactions') {
            iconName = 'swap-horizontal';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: 'purple',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {/* <Tab.Screen name="Dashboard" component={Dashboard} /> */}
      <Tab.Screen name="Transactions" component={Transactions} />
      <Tab.Screen name="Configure" component={Configure} />
    </Tab.Navigator>
  );
}
