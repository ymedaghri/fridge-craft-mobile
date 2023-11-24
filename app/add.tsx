import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, Surface } from 'react-native-paper';

import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function Add() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

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

  const onChange = async (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    if (event.type === 'set' && selectedDate !== undefined) {
      const currentDate = selectedDate || new Date();
      await storeData({
        name: code!,
        date: currentDate,
        color: 'red',
      });
      router.replace('/');
    }
  };

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatePicker = () => {
    showMode('date');
  };

  const handleBarCodeScanned = ({ data }: any) => {
    setCode(data);
    setScanned(true);
    setShowScanner(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {!showScanner ? (
        <ImageBackground
          source={smartFridgeImage}
          style={styles.backgroundImage}
        >
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
                  }}
                >
                  {code
                    ? `Cliquer sur le bouton pour saisir la date d'expiration du Produit ${code}`
                    : "Cliquer sur le bouton pour scanner l'article puis ajouter sa date d'expiration"}
                </Text>
              </Surface>

              {scanned ? (
                <Button
                  icon="calendar"
                  onPress={showDatePicker}
                  uppercase
                  mode="elevated"
                  style={{
                    backgroundColor: 'rgba(10, 220, 255, 1)',
                  }}
                >
                  DATE EXPIRATION
                </Button>
              ) : (
                <Button
                  icon="barcode-scan"
                  onPress={() => setShowScanner(true)}
                  uppercase
                  mode="elevated"
                  style={{
                    backgroundColor: 'rgba(10, 220, 255, 1)',
                  }}
                >
                  SCANNER PRODUIT
                </Button>
              )}
            </View>
          </View>
        </ImageBackground>
      ) : (
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={!showScanner ? undefined : handleBarCodeScanned}
        />
      )}
    </SafeAreaView>
  );
}
