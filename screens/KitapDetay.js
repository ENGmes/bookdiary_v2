import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { openDatabaseSync } from 'expo-sqlite';
import { useRoute, useNavigation } from '@react-navigation/native';

const db = openDatabaseSync('kitaplar.db');

export default function KitapDetay() {
  const route = useRoute();
  const navigation = useNavigation();
  const { kitapId } = route.params;

  const [kitap, setKitap] = useState(null);

  useEffect(() => {
    const getir = async () => {
      try {
        const row = await db.getFirstAsync(
          `SELECT * FROM kitaplarTBL WHERE kitapId = ?`,
          [kitapId]
        );
        if (row) setKitap(row);
      } catch (error) {
        console.log("Veri çekme hatası:", error);
      }
    };
    getir();
  }, [kitapId]);

  if (!kitap) {
    return <Text style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>Yükleniyor...</Text>;
  }

  return (
    <ImageBackground source={require('../assets/ab.jpg')} style={styles.background} resizeMode="cover" blurRadius={3}>
      <ScrollView contentContainerStyle={styles.container}>
        {kitap.resim && <Image source={{ uri: kitap.resim }} style={styles.kapak} />}
        <Text style={styles.isim}>{kitap.kitapAdi}</Text>
        <Text style={styles.yazar}>Yazar: {kitap.yazarAdi}</Text>
        <Text style={styles.tarih}>Tarih: {kitap.tarih}</Text>
        <Text style={styles.yorum}>{kitap.aciklama}</Text>
        <Text style={styles.puan}>
          {Array.from({ length: kitap.puan }, (_, i) => <Text key={i}> ⭐</Text>)}
        </Text>

        <TouchableOpacity
          style={styles.duzenleButon}
          onPress={() => navigation.navigate("KitapEkle", { duzenle: true, kitap })}
        >
          <Text style={styles.duzenleText}>Düzenle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { padding: 50, alignItems: 'center' },
  kapak: { width: 200, height: 300, borderRadius: 12, marginBottom: 20 },
  isim: { color: 'white', fontSize: 25, fontWeight: 'bold', marginBottom: 10 },
  yazar: { color: 'white', fontSize: 18, marginBottom: 6 },
  tarih: { color: 'white', fontSize: 16, marginBottom: 6 },
  yorum: { color: 'white', fontSize: 16, marginBottom: 12 },
  puan: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  duzenleButon: { marginTop: 40, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  duzenleText: { fontSize: 18, color: '#000', fontWeight: 'bold' },
});
