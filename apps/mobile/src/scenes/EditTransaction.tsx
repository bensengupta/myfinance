import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Paragraph,
  Subheading,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { useAppDispatch, useAppSelector } from '../app/store';
import { EditTransactionScreenProp } from '../navigators/RootStack';
import { Formik } from 'formik';
import DatePicker from 'react-native-date-picker';
import * as Yup from 'yup';
import { format, formatDistanceToNow } from 'date-fns';

import PageWrapper from '../ui/PageWrapper';
import {
  addTransaction,
  modifyTransaction,
} from '../features/transactions/transactionsSlice';

const NON_NEGATIVE_NUMBER_REGEX = /^[+]?([.]\d+|\d+([.]\d+)?)$/;

type Props = EditTransactionScreenProp;

export default function EditTransaction({ navigation, route }: Props) {
  const isEditing = !!route.params?.id;
  const transactionToEdit = useAppSelector(
    (state) => state.transactions.transactions
  ).find((transaction) => transaction.id === route.params?.id);

  const budgetAccounts = useAppSelector(
    (state) => state.accounts.budgetAccounts
  );
  const categories = useAppSelector((state) => state.categories.categories);
  const dispatch = useAppDispatch();

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const [accountDropdownVisible, setAccountDropdownVisible] = useState(false);
  const showAccountDropdown = () => setAccountDropdownVisible(true);
  const hideAccountDropdown = () => setAccountDropdownVisible(false);

  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const showCategoryDropdown = () => setCategoryDropdownVisible(true);
  const hideCategoryDropdown = () => setCategoryDropdownVisible(false);

  // User has no accounts
  if (budgetAccounts.length === 0) {
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

  // User has no categories
  if (categories.length === 0) {
    return (
      <PageWrapper>
        <ScrollView>
          <Title>
            No categories added, please add your accounts in the Configure tab
          </Title>
        </ScrollView>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ScrollView>
        <Formik
          initialValues={
            transactionToEdit
              ? {
                  credit: transactionToEdit.credit.toString(),
                  debit: transactionToEdit.debit.toString(),
                  date: new Date(transactionToEdit.date),
                  account: transactionToEdit.account,
                  category: transactionToEdit.category,
                  comment: transactionToEdit.comment,
                }
              : {
                  credit: '',
                  debit: '',
                  date: new Date(),
                  account: budgetAccounts[0].name,
                  category: categories[0].name,
                  comment: '',
                }
          }
          validationSchema={Yup.object().shape(
            {
              credit: Yup.string()
                .matches(
                  // Regex ensures credit is a number, either an int or a float
                  NON_NEGATIVE_NUMBER_REGEX,
                  'Credit must be a positive number'
                )
                .when('debit', {
                  is: (debit) => !debit || debit.length === 0,
                  then: Yup.string()
                    .matches(
                      NON_NEGATIVE_NUMBER_REGEX,
                      'Credit must be a positive number'
                    )
                    .required('Either credit or debit is required'),
                }),
              debit: Yup.string()
                .matches(
                  // Regex ensures debit is a number, either an int or a float
                  NON_NEGATIVE_NUMBER_REGEX,
                  'Debit must be a positive number'
                )
                .when('credit', {
                  is: (credit) => !credit || credit.length === 0,
                  then: Yup.string()
                    .matches(
                      NON_NEGATIVE_NUMBER_REGEX,
                      'Debit must be a positive number'
                    )
                    .required('Either credit or debit is required'),
                }),
              date: Yup.date().required('Date required'),
              account: Yup.string().required('Account required'),
              category: Yup.string().required('Category required'),
              comment: Yup.string(),
            },
            [['credit', 'debit']]
          )}
          onSubmit={({ credit, debit, date, comment, ...rest }) => {
            if (isEditing) {
              dispatch(
                modifyTransaction({
                  id: route.params.id,
                  credit: Number(credit || '0'),
                  debit: Number(debit || '0'),
                  date: date.toISOString(),
                  comment: comment === '' ? undefined : comment,
                  ...rest,
                })
              );
            } else {
              dispatch(
                addTransaction({
                  credit: Number(credit || '0'),
                  debit: Number(debit || '0'),
                  date: date.toISOString(),
                  comment: comment === '' ? undefined : comment,
                  ...rest,
                })
              );
            }
            navigation.goBack();
          }}
        >
          {({
            submitForm,
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            setFieldValue,
          }) => (
            <View style={styles.section}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Subheading>Date</Subheading>
                  <Paragraph>
                    {format(values.date, 'yyyy-MM-dd')} (
                    {formatDistanceToNow(values.date, { addSuffix: true })})
                  </Paragraph>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Button mode="outlined" onPress={showDatePicker}>
                    Change
                  </Button>
                </View>
              </View>
              <DatePicker
                modal
                open={datePickerVisible}
                date={values.date}
                mode="date"
                onConfirm={(date) => {
                  hideDatePicker();
                  setFieldValue('date', date);
                }}
                onCancel={hideDatePicker}
              />
              <TextInput
                mode="outlined"
                label="Credit"
                value={values.credit}
                onChangeText={handleChange('credit')}
                onBlur={handleBlur('credit')}
                keyboardType="numeric"
              />
              <HelperText
                type="error"
                visible={!!errors.credit && touched.credit}
              >
                {errors.credit}
              </HelperText>
              <TextInput
                mode="outlined"
                label="Debit"
                value={values.debit}
                onChangeText={handleChange('debit')}
                onBlur={handleBlur('debit')}
                keyboardType="numeric"
              />
              <HelperText
                type="error"
                visible={!!errors.debit && touched.debit}
              >
                {errors.debit}
              </HelperText>
              <DropDown
                mode="outlined"
                label="Account"
                visible={accountDropdownVisible}
                onDismiss={() => {
                  hideAccountDropdown();
                  handleBlur('account');
                }}
                showDropDown={showAccountDropdown}
                list={budgetAccounts.map(({ name }) => ({
                  label: name,
                  value: name,
                }))}
                value={values.account}
                setValue={handleChange('account')}
                placeholder="Select an account"
              />
              <HelperText
                type="error"
                visible={!!errors.account && touched.account}
              >
                {errors.account}
              </HelperText>
              <DropDown
                mode="outlined"
                label="Category"
                visible={categoryDropdownVisible}
                onDismiss={() => {
                  hideCategoryDropdown();
                  handleBlur('category');
                }}
                showDropDown={showCategoryDropdown}
                list={categories.map(({ name }) => ({
                  label: name,
                  value: name,
                }))}
                value={values.category}
                setValue={handleChange('category')}
                placeholder="Select a category"
              />
              <HelperText
                type="error"
                visible={!!errors.category && touched.category}
              >
                {errors.category}
              </HelperText>
              <TextInput
                mode="outlined"
                label="Comment (optional)"
                value={values.comment}
                onChangeText={handleChange('comment')}
                onBlur={handleBlur('comment')}
              />
              <HelperText
                type="error"
                visible={!!errors.comment && touched.comment}
              >
                {errors.comment}
              </HelperText>
              <Button onPress={() => submitForm()}>Submit</Button>
            </View>
          )}
        </Formik>
      </ScrollView>
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
