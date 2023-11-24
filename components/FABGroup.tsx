import React from 'react';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import {
  Button,
  FAB,
  Dialog,
  Portal,
  PaperProvider,
  Text,
} from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FABGroup() {
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }: { open: boolean }) => setState({ open });

  const { open } = state;

  const removeAllProducts = async () => {
    await AsyncStorage.setItem('fridge-craft-products', JSON.stringify([]));
    router.replace('/');
  };

  return (
    <PaperProvider>
      <Portal>
        <FAB.Group
          backdropColor="rgba(0, 150, 150, 0.9)"
          open={open}
          visible
          icon={open ? 'close' : 'barcode-scan'}
          actions={[
            {
              icon: 'plus',
              label: 'Ajouter un produit',
              onPress: () => {
                if (Platform.OS === 'web') router.push('/add-web');
                else router.push('/add');
              },
            },
            {
              icon: 'calendar-edit',
              label: 'Modifier date expiration',
              onPress: () => console.log('Pressed star'),
            },
            {
              icon: 'delete',
              label: 'Jeter un produit',
              onPress: () => console.log('Pressed email'),
            },
            {
              icon: 'playlist-remove',
              label: 'Supprimer tous les produits',
              onPress: showDialog,
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Attention !</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Si vous confirmez vous allez supprimer tous les produits, êtes
              vous sûr de vouloir continuer ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Non</Button>
            <Button onPress={removeAllProducts}>Oui</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
}
