import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { openDatabaseSync } from 'expo-sqlite';  
import { useFocusEffect } from '@react-navigation/native';

const db = openDatabaseSync('kitaplar.db');

export default function KitaplarScreen({ navigation }) {
  const [kitaplar, setKitaplar] = useState([]);
  const [arama, setArama] = useState('');

  useFocusEffect(
    useCallback(() => {
      const kitaplariYukle = async () => {
        try {
          const rows = await db.getAllAsync(
            `SELECT * FROM kitaplarTBL ORDER BY kitapId DESC;`
          );
          setKitaplar(rows);
        } catch (error) {
          console.log('Veri çekme hatası:', error);
        }
      };
      kitaplariYukle();
    }, [])
  );

  const filtrelenmisKitaplar = kitaplar.filter((kitap) =>
    kitap.kitapAdi?.toLowerCase().includes(arama.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.kitapBox}
      onPress={() => navigation.navigate('KitapDetay', { kitapId: item.kitapId })}
    >
      {item.resim && <Image source={{ uri: item.resim }} style={styles.kapak} />}
      <View style={styles.kitapBilgi}>
        <Text style={styles.kitapIsmi}>{item.kitapAdi}</Text>
        <Text>Yazar: {item.yazarAdi}</Text>
        <Text>Tarih: {item.tarih}</Text>
        <Text>Açıklama: {item.aciklama}</Text>
        <Text>{"⭐".repeat(item.puan || 0)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../assets/cb.jpg')} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <TextInput
          style={styles.araInput}
          placeholder="Kitap Ara"
          placeholderTextColor="#888"
          value={arama}
          onChangeText={setArama}
        />
        <FlatList
          data={filtrelenmisKitaplar}
          keyExtractor={(item) => item.kitapId.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.liste}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', padding: 16 },
  araInput: { backgroundColor: '#ffffff66', borderRadius: 8, padding: 10, marginBottom: 10 },
  kitapBox: { backgroundColor: '#ffffff66', padding: 12, borderRadius: 10, marginBottom: 12, flexDirection: 'row' },
  kitapBilgi: { flex: 1, marginLeft: 10 },
  kitapIsmi: { fontSize: 18, fontWeight: 'bold' },
  kapak: { width: 80, height: 120, borderRadius: 8 },
  liste: { paddingBottom: 20 },
});
