import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  Dialog,
  IconButton,
  List,
  Menu,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { renameAccount, removeAccount, addAccount } from './accountsSlice';

function BudgetAccountItemDialog({
  visible,
  hide,
  initialText,
}: {
  visible: boolean;
  hide: () => void;
  initialText?: string;
}) {
  const dispatch = useAppDispatch();

  const [text, setText] = useState(initialText ?? '');
  useEffect(() => setText(initialText ?? ''), [initialText]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hide}>
        <Dialog.Title>Edit Account</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Account"
            mode="outlined"
            value={text}
            onChangeText={(text) => setText(text)}
            autoFocus
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              if (initialText) {
                dispatch(renameAccount({ old: initialText, new: text }));
              } else {
                dispatch(addAccount(text));
              }
              hide();
            }}
          >
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

function BudgetAccountItem({
  accountName,
  onRenamePressed,
}: {
  accountName: string;
  onRenamePressed?: () => void;
}) {
  const dispatch = useAppDispatch();

  const [menuVisible, setMenuVisible] = useState(false);
  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  return (
    <View>
      <List.Item
        title={accountName}
        left={(props) => <List.Icon {...props} icon="wallet" />}
        right={(props) => (
          <Menu
            visible={menuVisible}
            anchor={
              <IconButton {...props} icon="dots-vertical" onPress={showMenu} />
            }
            onDismiss={hideMenu}
          >
            <Menu.Item
              onPress={() => {
                hideMenu();
                onRenamePressed?.();
              }}
              title="Rename"
            />
            <Menu.Item
              onPress={() => dispatch(removeAccount(accountName))}
              title="Remove"
              titleStyle={{ color: 'red' }}
            />
          </Menu>
        )}
      />
    </View>
  );
}

function BudgetAccountNewItem({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <List.Item
      title="Add Account"
      titleStyle={{ color: colors.primary }}
      left={(props) => (
        <List.Icon {...props} icon="plus" color={colors.primary} />
      )}
      onPress={onPress}
    />
  );
}

export default function BudgetAccounts() {
  const budgetAccounts = useAppSelector(
    (state) => state.accounts.budgetAccounts
  );

  const [text, setText] = useState<string | undefined>(undefined);

  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  return (
    <View>
      {budgetAccounts.map(({ name }) => (
        <BudgetAccountItem
          key={name}
          accountName={name}
          onRenamePressed={() => {
            setText(name);
            showDialog();
          }}
        />
      ))}
      <BudgetAccountNewItem
        onPress={() => {
          setText(undefined);
          showDialog();
        }}
      />
      <BudgetAccountItemDialog
        visible={dialogVisible}
        hide={hideDialog}
        initialText={text}
      />
    </View>
  );
}
