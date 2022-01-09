/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Title } from 'react-native-paper';

import BudgetAccounts from '../features/accounts/BudgetAccounts';
import Categories from '../features/categories/Categories';
import PageWrapper from '../ui/PageWrapper';

export default function Configure() {
  return (
    <PageWrapper>
      <ScrollView>
        <View style={styles.section}>
          <Title>Budget Accounts</Title>
          <BudgetAccounts />
          <Title>Categories</Title>
          <Categories />
        </View>
      </ScrollView>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 24,
    marginHorizontal: 12,
  },
});
