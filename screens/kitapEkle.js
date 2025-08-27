import React, { useState, useEffect } from "react";
import { ImageBackground, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { openDatabaseSync } from "expo-sqlite";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const db = openDatabaseSync("kitaplar.db");
db.execSync(
  "CREATE TABLE IF NOT EXISTS kitaplarTBL (kitapId INTEGER PRIMARY KEY AUTOINCREMENT, kitapAdi TEXT, yazarAdi TEXT, aciklama TEXT, tarih TEXT, puan INTEGER, resim TEXT);"
);

export default function KitapEkle() {
  const [kitapId, setKitapId] = useState(null);
  const [kitapAdi, setKitapAdi] = useState("");
  const [yazarAdi, setYazarAdi] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [tarih, setTarih] = useState("");
  const [puan, setPuan] = useState(0);
  const [resim, setResim] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const duzenlenecekKitap = route.params?.kitap;

  useEffect(() => {
    if (duzenlenecekKitap) {
      setKitapId(duzenlenecekKitap.kitapId);
      setKitapAdi(duzenlenecekKitap.kitapAdi);
      setYazarAdi(duzenlenecekKitap.yazarAdi);
      setAciklama(duzenlenecekKitap.aciklama);
      setTarih(duzenlenecekKitap.tarih);
      setPuan(duzenlenecekKitap.puan);
      setResim(duzenlenecekKitap.resim);
    }
  }, [duzenlenecekKitap]);

  const resimSec = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setResim(result.assets[0].uri);
    }
  };

  const kaydet = () => {
    if (!kitapAdi || !yazarAdi) {
      Alert.alert("Uyarı", "Kitap adı ve yazar adı zorunludur!");
      return;
    }

    if (kitapId) {
      db.runSync(
        "UPDATE kitaplarTBL SET kitapAdi=?, yazarAdi=?, aciklama=?, tarih=?, puan=?, resim=? WHERE kitapId=?",
        [kitapAdi, yazarAdi, aciklama, tarih, puan, resim, kitapId]
      );
      Alert.alert("Başarılı", "Kitap güncellendi.");
    } else {
      db.runSync(
        "INSERT INTO kitaplarTBL (kitapAdi, yazarAdi, aciklama, tarih, puan, resim) VALUES (?, ?, ?, ?, ?, ?)",
        [kitapAdi, yazarAdi, aciklama, tarih, puan, resim]
      );
      Alert.alert("Başarılı", "Kitap kaydedildi.");
    }
    navigation.goBack();
  };

  const sil = () => {
    if (!kitapId) return;
    Alert.alert(
      "Silme Onayı",
      "Bu kitabı silmek istediğinizden emin misiniz?",
      [
        { text: "İptal" },
        {
          text: "Sil",
          onPress: () => {
            db.runSync("DELETE FROM kitaplarTBL WHERE kitapId=?", [kitapId]);
            Alert.alert("Başarılı", "Kitap silindi.");
            navigation.goBack();
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require('../assets/ab.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={resimSec} style={styles.imagePicker}>
          {resim ? <Image source={{ uri: resim }} style={styles.image} /> : <Text style={{ color: 'white' }}>Resim Seç</Text>}
        </TouchableOpacity>

        <TextInput style={styles.input} placeholder="Kitap Adı" placeholderTextColor={"#ffffff90"} value={kitapAdi} onChangeText={setKitapAdi} />
        <TextInput style={styles.input} placeholder="Yazar Adı" placeholderTextColor={"#ffffff90"} value={yazarAdi} onChangeText={setYazarAdi} />
        <TextInput style={[styles.input, { paddingBlock: 40 }]} placeholder="Açıklama" placeholderTextColor={"#ffffff90"} value={aciklama} onChangeText={setAciklama} multiline />
        <TextInput style={styles.input} placeholder="Tarih" placeholderTextColor={"#ffffff90"} value={tarih} onChangeText={setTarih} />

        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((item) => (
            <TouchableOpacity key={item} onPress={() => setPuan(item)}>
              <FontAwesome name={item <= puan ? "star" : "star-o"} size={35} color="gold" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={kaydet}>
          <Text style={styles.buttonText}>{kitapId ? "Güncelle" : "Kaydet"}</Text>
        </TouchableOpacity>

        {kitapId && (
          <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={sil}>
            <Text style={styles.buttonText}>Sil</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, { marginTop: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>İptal</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: "center" },
  input: { color: 'white', width: "100%", borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 10, borderRadius: 5 },
  button: { top: 10, backgroundColor: "rgba(255,255,255,0.2)", padding: 15, borderRadius: 10, marginTop: 10, width: "100%", alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
  imagePicker: { backgroundColor: 'rgba(255,255,255,0.2)', width: 150, height: 200, borderWidth: 1, borderColor: "#aaa", marginBottom: 10, justifyContent: "center", alignItems: "center", borderRadius: 15 },
  image: { width: "100%", height: "100%" },
  stars: { flexDirection: "row", marginVertical: 15 },
});
