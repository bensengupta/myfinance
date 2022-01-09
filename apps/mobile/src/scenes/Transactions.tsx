import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FAB, Title } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { useAppSelector } from '../app/store';

import TransactionsList from '../features/transactions/TransactionsList';
import { TransactionsScreenProp } from '../navigators/HomeTabs';
import PageWrapper from '../ui/PageWrapper';

type Props = TransactionsScreenProp;

export default function Transactions({ navigation }: Props) {
  const accounts = useAppSelector((state) => state.accounts.budgetAccounts);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const showDropdown = () => setDropdownVisible(true);
  const hideDropdown = () => setDropdownVisible(false);

  const [selectedAccount, setSelectedAccount] = useState(
    accounts.length !== 0 ? accounts[0].name : undefined
  );

  // User has no accounts
  if (accounts.length === 0) {
    return (
      <PageWrapper>
        <ScrollView>
          <Title>
            No accounts added, please add your accounts in the Configure tab
          </Title>
        </ScrollView>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <View style={styles.section}>
        <DropDown
          visible={dropdownVisible}
          onDismiss={hideDropdown}
          showDropDown={showDropdown}
          list={accounts.map(({ name }) => ({ label: name, value: name }))}
          value={selectedAccount}
          setValue={setSelectedAccount}
          placeholder="Select an account"
        />
        <TransactionsList
          accountName={selectedAccount}
          onModifyPressed={(id) =>
            navigation.navigate('EditTransaction', { id })
          }
        />
      </View>
      <FAB
        icon="plus"
        onPress={() => navigation.navigate('EditTransaction')}
        style={styles.fab}
      />
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 24,
    marginHorizontal: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
