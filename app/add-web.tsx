import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Surface } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { router } from 'expo-router';
import smartFridgeImage from '../assets/images/bg-smart-fridge.png';
import { Product } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default function App() {
  const [date, setDate] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [code] = useState(`IMAGINARY-${Math.round(Math.random() * 1000000)}`);

  const storeData = async (product: Product) => {
    try {
      const jsonValue = await AsyncStorage.getItem('fridge-craft-products');
      const products = jsonValue != null ? JSON.parse(jsonValue) : [];
      products.push(product);
      await AsyncStorage.setItem(
        'fridge-craft-products',
        JSON.stringify(products),
      );
    } catch (e) {
      // saving error
    }
  };

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    async (params) => {
      setOpen(false);
      setDate(params.date);
      await storeData({
        name: code!,
        date: params.date,
        color: 'red',
      });
      router.replace('/');
    },
    [setOpen, setDate],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={smartFridgeImage} style={styles.backgroundImage}>
        <Text
          style={{
            color: 'white',
            backgroundColor: 'rgba(0, 150, 150, 0.8)',
            textAlign: 'center',
            fontSize: 20,
            paddingVertical: 5,
          }}
        >
          AJOUTER UN PRODUIT
        </Text>
        <View
          style={{
            height: 380,
            padding: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              gap: 30,
            }}
          >
            <Surface
              elevation={1}
              style={{
                backgroundColor: 'rgba(10, 220, 255, 1)',
                borderRadius: 30,
                padding: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  textAlign: 'center',
                  //  backgroundColor: 'rgba(255, 255, 255, 1)',
                  //  borderRadius: 20,
                  //  padding: 20,
                }}
              >
                {`Cliquer sur le bouton pour saisir la date d'expiration duProduit ${code}`}
              </Text>
            </Surface>
            <Button
              icon="calendar"
              onPress={() => setOpen(true)}
              uppercase={false}
              mode="elevated"
              style={{
                backgroundColor: 'rgba(10, 220, 255, 1)',
              }}
            >
              DATE EXPIRATION
            </Button>
            <DatePickerModal
              locale="fr"
              mode="single"
              visible={open}
              onDismiss={onDismissSingle}
              date={date}
              onConfirm={onConfirmSingle}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
