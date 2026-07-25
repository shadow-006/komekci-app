# Köməkçim 📱

Gündəlik həyatı asanlaşdıran şəxsi köməkçi mobil tətbiqi — tapşırıq planlaması, büdcə izləmə, su/kalori hesabı, hava proqnozu və real alarm-saat funksiyası bir yerdə.

Android üçün React Native (Expo) ilə hazırlanıb.

## 📥 Necə yükləmək olar

Bu tətbiq hələ Google Play-də deyil. Yükləmək üçün iki yol var:

### 1) Hazır APK-nı yükləmək (ən asan yol)

1. Bu linki telefonun brauzerində açın: **https://expo.dev/accounts/ali0066/projects/assistant-app/builds**
   (siyahıdan ən son, "preview" profilli, uğurlu (yaşıl) build-i seçin)
2. "Install" / "Download" düyməsinə basın, APK telefona yüklənəcək
3. Yükləyəndən sonra açın — telefon "naməlum mənbədən quraşdırma" icazəsi istəyə bilər, icazə verin
4. Quraşdırma bitəndə app-i açın

> **Qeyd:** Android "Play Store xaricindən" APK quraşdırarkən xəbərdarlıq göstərir — bu normaldır, "Yenə də quraşdır" seçin.

### 2) Özün mənbə koddan qurmaq

Node.js və bir [Expo](https://expo.dev) hesabı lazımdır.

```bash
git clone https://github.com/shadow-006/komekci-app.git
cd komekci-app
npm install
npx eas-cli build --profile preview --platform android
```

Build bitəndə (~10-15 dəqiqə) çıxan linki telefonda açıb quraşdırın.

## 📱 Necə istifadə etmək olar

Tətbiqin aşağıda 5 bölməsi (tab) var:

### 🏠 Ana
Açılış ekranı — salamlama, o anki hava dərəcəsi (yerinizə görə avtomatik), su/kalori mini-göstəriciləri və bugünkü tapşırıqlarınız. Yuxarıdan birbaşa yeni tapşırıq əlavə edə bilərsiniz.

### 💰 Büdcə
- "Xərc" və ya "Gəlir" seçib məbləğ+ad yazaraq **Əlavə et**
- Bu ayın ümumi balansını, gəlir/xərc cəmini görün
- Aylıq xərc hədəfi qoyub xərcinizi izləyin

### 📅 Planlama
- Təqvimdə istənilən günə klikləyib o gün üçün plan/tapşırıq yazın
- Planı olan günlərin üstündə nöqtə görünür (mavi = qalıb, yaşıl = hamısı bitib)
- Sabahı, gələn həftəni əvvəlcədən planlaşdıra bilərsiniz

### 💧 Sağlamlıq
- Su və kalori üçün sürətli düymələr (+100, +250, +500)
- Öz gündəlik hədəflərinizi təyin edin
- Hər gün avtomatik sıfırlanır, istəsəniz əl ilə də sıfırlaya bilərsiniz

### ⏰ Alarmlar
- Vaxt seçin, ad yazın, "Hər gün təkrarla" seçimini edin → **Alarm qur**
- Vaxtı çatanda tam-ekran, davamlı zəng çalır (telefon səssiz rejimdə olsa belə)
- **Dayandır** basanda o günün tapşırıqları dərhal sizə göstərilir
- **Təxirə sal** ilə 5 dəqiqəyə təxirə sala bilərsiniz

## 🛠️ Texniki qeydlər (developerlər üçün)

- **Stack:** Expo SDK 54, React Native 0.81, TypeScript
- **Alarm sistemi:** `@notifee/react-native` (tam-ekran + `AlarmManager.setAlarmClock`)
- **Data saxlama:** Tamamilə lokal (`AsyncStorage`), internet lazım deyil
- **Hava:** [Open-Meteo](https://open-meteo.com) API (pulsuz, açar tələb etmir) + `expo-location`

### Development build ilə işə salmaq

```bash
npm install
npx expo start --dev-client
```
