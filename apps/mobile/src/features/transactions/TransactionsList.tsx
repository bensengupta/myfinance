import { format } from 'date-fns';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  Caption,
  Divider,
  IconButton,
  Menu,
  Subheading,
  Text,
  useTheme,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Transaction, removeTransaction } from './transactionsSlice';

function TransactionItem({
  transaction,
  onModifyPressed,
}: {
  transaction: Transaction;
  onModifyPressed?: () => void;
}) {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const [menuVisible, setMenuVisible] = useState(false);
  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  const { credit, debit, date, comment, category, account } = transaction;

  const isTransactionPositive = credit > debit;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <View style={{ paddingRight: 10, flex: 1 }}>
        <Caption style={{ fontFamily: 'monospace' }}>
          {format(new Date(date), 'yyyy-MM-dd')}
        </Caption>
        <Text numberOfLines={1}>
          {category} {comment ? `(${comment})` : ''}
        </Text>
      </View>
      <Subheading
        style={{
          fontFamily: 'monospace',
          fontWeight: '700',
          color: isTransactionPositive ? 'green' : 'red',
        }}
      >
        {isTransactionPositive ? '+' : ''}
        {(credit - debit).toFixed(2)}
      </Subheading>
      <Menu
        visible={menuVisible}
        anchor={
          <IconButton
            size={24}
            color={colors.disabled}
            icon="dots-vertical"
            onPress={showMenu}
          />
        }
        onDismiss={hideMenu}
      >
        <Menu.Item
          onPress={() => {
            hideMenu();
            onModifyPressed?.();
          }}
          title="Modify"
        />
        <Menu.Item
          onPress={() => dispatch(removeTransaction(transaction.id))}
          title="Remove"
          titleStyle={{ color: 'red' }}
        />
      </Menu>
    </View>
  );
}

export default function TransactionsList({
  onModifyPressed,
  accountName,
}: {
  onModifyPressed: (id: string) => void;
  accountName: string;
}) {
  const transactions = useAppSelector(
    (state) => state.transactions.transactions
  ).filter((trsc) => trsc.account === accountName);

  return (
    <View>
      <FlatList
        scrollEnabled
        data={transactions}
        renderItem={({ item: transaction }) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onModifyPressed={() => onModifyPressed(transaction.id)}
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
