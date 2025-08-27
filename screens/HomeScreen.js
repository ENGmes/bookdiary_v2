import React, { useState, useEffect } from 'react';
import { ImageBackground, Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('kitaplar.db');

export default function HomeScreen({ navigation }) {
  const [sonKitaplar, setSonKitaplar] = useState([]);

  useEffect(() => {
    const kitaplariYukle = async () => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS kitaplarTBL (
            kitapId INTEGER PRIMARY KEY AUTOINCREMENT,
            kitapAdi TEXT,
            yazarAdi TEXT,
            aciklama TEXT,
            tarih TEXT,
            puan INTEGER,
            resim TEXT
          );
        `);

        const rows = await db.getAllAsync(
          `SELECT * FROM kitaplarTBL ORDER BY kitapId DESC LIMIT 3;`
        );
        setSonKitaplar(rows);
      } catch (error) {
        console.log('Veri çekme hatası:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', kitaplariYukle);
    return unsubscribe;
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/ab.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={[styles.title, { marginTop: 100 }]}>KİTAP GÜNLÜĞÜM</Text>
        <Image source={require('../assets/kglogo.png')} style={styles.logo} />

        <View style={styles.sonKitaplarContainer}>
          <Text style={styles.sonKitaplarBaslik}>Son Eklenen Kitaplar</Text>
          {sonKitaplar.length === 0 && (
            <Text style={{ color: '#ffffff96' }}>Henüz kitap yok.</Text>
          )}

          {sonKitaplar.map((kitap) => (
            <TouchableOpacity
              key={kitap.kitapId}
              style={styles.kitapBox}
              onPress={() => navigation.navigate('KitapDetay', { kitapId: kitap.kitapId })}
            >
              {kitap.resim && <Image source={{ uri: kitap.resim }} style={styles.kapak} />}
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.kitapIsmi}>{kitap.kitapAdi}</Text>
                <Text style={{ color: 'white' }}>{kitap.yazarAdi}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Kitaplar')}
          style={[styles.button, { marginTop: -20 }]}
        >
          <Text style={styles.buttonText}>Tüm Kitapları Görüntüle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('KitapEkle')}
          style={[styles.button, { marginTop: 50 }]}
        >
          <Text style={styles.buttonText}>Kitap Ekle</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 100 },
  title: { fontWeight: 'bold', fontStyle: 'italic', fontSize: 50, color: 'rgba(255, 255, 255, 0.44)', textAlign: 'center' },
  sonKitaplarContainer: { marginBottom: 20 },
  sonKitaplarBaslik: { marginTop: 20, fontSize: 22, fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.44)', marginBottom: 5 },
  kitapBox: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  kapak: { width: 50, height: 70, borderRadius: 6 },
  kitapIsmi: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  button: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  logo: { height: 250, width: 250, position: "absolute", top: 30, left: 80, opacity: 0.60 },
});
