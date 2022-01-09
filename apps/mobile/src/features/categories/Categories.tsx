import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
import {
  addCategory,
  Category,
  changeCategoryGroup,
  removeCategory,
  renameCategory,
} from './categoriesSlice';
import DropDown from 'react-native-paper-dropdown';

function CategoryItemDialog({
  visible,
  hide,
  initialText,
  initialGroup,
}: {
  visible: boolean;
  hide: () => void;
  initialText?: string;
  initialGroup?: string;
}) {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.categories.groups);

  // Hack: user should be able to select no group
  // But all dropdown elements must have an id, thus no group has the id below
  // to prevent users from accidentally choosing "No Group"
  const NO_GROUP = 'V1StGXR8_Z5jdHi6B-myT';

  const [text, setText] = useState(initialText ?? '');
  useEffect(() => setText(initialText ?? ''), [initialText]);
  const [group, setGroup] = useState(initialGroup ?? '');
  useEffect(() => setGroup(initialGroup ?? NO_GROUP), [initialGroup]);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const showDropdown = () => setDropdownVisible(true);
  const hideDropdown = () => setDropdownVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hide}>
        <Dialog.Title>Edit Category</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Category"
            mode="outlined"
            value={text}
            onChangeText={(text) => setText(text)}
            autoFocus
          />
          <DropDown
            label="Group"
            mode="outlined"
            visible={dropdownVisible}
            showDropDown={showDropdown}
            onDismiss={hideDropdown}
            value={group}
            setValue={setGroup}
            list={[
              ...groups.map(({ name }) => ({ label: name, value: name })),
              { label: 'No Group', value: NO_GROUP },
            ]}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              const newGroup = group === NO_GROUP ? undefined : group;
              if (initialText) {
                dispatch(renameCategory({ old: initialText, new: text }));
                dispatch(changeCategoryGroup({ category: text, newGroup }));
              } else {
                dispatch(addCategory({ name: text, group: newGroup }));
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

function CategoryItem({
  category,
  onRenamePressed,
}: {
  category: Category;
  onRenamePressed?: () => void;
}) {
  const dispatch = useAppDispatch();

  const [menuVisible, setMenuVisible] = useState(false);
  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  return (
    <View>
      <List.Item
        title={category.name}
        description={category.group}
        left={(props) => <List.Icon {...props} icon="shape" />}
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
              title="Modify"
            />
            <Menu.Item
              onPress={() => dispatch(removeCategory(category.name))}
              title="Remove"
              titleStyle={{ color: 'red' }}
            />
          </Menu>
        )}
      />
    </View>
  );
}

function CategoryNewItem({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <List.Item
      title="Add Category"
      titleStyle={{ color: colors.primary }}
      left={(props) => (
        <List.Icon {...props} icon="plus" color={colors.primary} />
      )}
      onPress={onPress}
    />
  );
}

export default function Categories() {
  const categories = useAppSelector((state) => state.categories.categories);

  const [text, setText] = useState(undefined);
  const [group, setGroup] = useState(undefined);

  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  return (
    <View>
      {categories.map((cat) => (
        <CategoryItem
          key={cat.name}
          category={cat}
          onRenamePressed={() => {
            setText(cat.name);
            setGroup(cat.group);
            showDialog();
          }}
        />
      ))}
      <CategoryNewItem
        onPress={() => {
          setText(undefined);
          setGroup(undefined);
          showDialog();
        }}
      />
      <CategoryItemDialog
        visible={dialogVisible}
        hide={hideDialog}
        initialText={text}
        initialGroup={group}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
