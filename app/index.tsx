import React, { useEffect, useState } from 'react';
import { Surface } from 'react-native-paper';

import {
  ScrollView,
  ImageBackground,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import smartFridgeImage from '../assets/images/bg-smart-fridge.png';
import FABGroup from '../components/FABGroup';

export type Product = {
  name: string;
  date: Date;
  daysDiff?: number;
  color?: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollView: {
    maxHeight: 315,
    marginTop: 40,
  },
  productLabel: {
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 30,
    color: 'white',
  },
  orange: {
    backgroundColor: 'rgba(255, 100, 0, 0.8)',
  },
  red: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
  },
  black: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  green: {
    backgroundColor: 'rgba(0, 127, 0, 0.8)',
  },
});

export default function Main() {
  const [products, setProducts] = useState<Product[]>([]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const addColorAndDayDiffInformations = (productDateString: string) => {
    const productDate = new Date(productDateString);
    productDate.setHours(0, 0, 0, 0);

    const timeDiff = productDate.getTime() - today.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff < 0) {
      return { color: 'black', daysDiff };
    }
    if (daysDiff === 0) {
      return { color: 'red', daysDiff };
    }
    if (daysDiff === 1) {
      return { color: 'orange', daysDiff };
    }
    return { color: 'green', daysDiff };
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('fridge-craft-products');
        if (jsonValue != null) {
          setProducts(
            JSON.parse(jsonValue)
              .map((product: any) => ({
                ...product,
                ...addColorAndDayDiffInformations(product.date),
              }))
              .sort(
                (p1: Product, p2: Product) =>
                  (p1.daysDiff ?? 0) - (p2.daysDiff ?? 0),
              ),
          );
        }
      } catch (e) {
        console.error('error during load');
      }
    };
    getData();
  }, []);

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
          Produits a consommer bientôt
        </Text>
      </ImageBackground>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator>
        {products.map((product: Product) => (
          <Surface
            key={product.name}
            elevation={1}
            style={[
              styles[product.color as keyof typeof styles],
              {
                marginHorizontal: 10,
                marginVertical: 5,
                borderRadius: 10,
              },
            ]}
          >
            <Text style={[styles.productLabel]}>
              {product.name} ({new Date(product.date).toDateString()})
            </Text>
          </Surface>
        ))}
      </ScrollView>
      <FABGroup />
    </SafeAreaView>
  );
}
