# HCR Currency and Ad Block Inject

Frida proof-of-concept scripts from a mobile penetration test of **Hill Climb Racing (Android)**. They show that the app can be hooked at runtime without detection, and that the in-game currency and ad libraries can be manipulated on the client side.

> **English summary:** Final project for the Mobile Penetration Testing course at BINUS University. Two findings: (1) no Frida / anti-tampering detection, (2) client-side trust of in-game currency values. This repository contains the proof-of-concept script only, for education and responsible disclosure.

## Disclaimer

Proyek ini dibuat **hanya untuk tujuan edukasi** sebagai bagian dari tugas akhir pengujian keamanan aplikasi mobile.

- Hanya dijalankan pada perangkat milik sendiri dan pada game single-player.
- Jangan dipakai untuk merugikan pengembang, pemain lain, atau layanan online.
- Jangan dipakai untuk mendistribusikan aplikasi yang dimodifikasi.
- Semua hak atas Hill Climb Racing dimiliki Fingersoft. Repository ini tidak berafiliasi dengan Fingersoft.

## Ringkasan pengujian

| Item | Detail |
| --- | --- |
| Target | Hill Climb Racing (Fingersoft) dari Google Play Store |
| Package name | `com.fingersoft.hillclimb` |
| Platform | Android |
| Perangkat uji | Samsung SM-A305F (rooted) |
| Tanggal uji | 26 Juni 2026 |
| Alat | JADX, APKTool, Frida |
| Metodologi | Information gathering, static analysis, dynamic analysis, exploitation and validation, risk assessment, reporting |

## Temuan

| # | Temuan | CVSS | OWASP Mobile Top 10 |
| --- | --- | --- | --- |
| 1 | Runtime manipulation via Frida (tanpa deteksi) | 3.3 | M8 |
| 2 | Modifikasi currency / manipulasi ekonomi in-game | 6.2 | M9 |

### 1. Runtime manipulation via Frida

Aplikasi dapat di-hook penuh oleh Frida tanpa ada deteksi atau penghentian dari sisi aplikasi. Script ad block memakai hook pada `Class.forName` untuk mencegah library iklan (`com.fingersoft.game` dan `org.cocos2dx.lib`) diinisialisasi saat aplikasi berjalan.

Dampak: logika client-side dapat diubah, mekanisme keamanan di sisi klien dapat dilewati, dan data di memori dapat dibaca atau diubah.

### 2. Modifikasi currency

Fungsi `getIntegerForKey` pada class `Cocos2dxUserDefault` di-hook sehingga pembacaan nilai `coins`, `gems`, atau `diamonds` mengembalikan nilai yang ditentukan penguji (999.999.999 untuk coins dan 999.999 untuk gems). Nilai berubah di dalam game hanya sekitar satu menit setelah script dijalankan.

Dampak: aplikasi mempercayai data ekonomi dari sisi klien tanpa validasi di server.

## Isi repository

| File | Keterangan |
| --- | --- |
| `script.js` | Script Frida untuk proof-of-concept blok iklan dan manipulasi currency |
| `README.md` | Dokumentasi ini |

## Cara menjalankan (lingkungan uji sendiri)

Prasyarat:

- Perangkat Android yang sudah di-root dan dipakai khusus untuk pengujian
- `frida-server` di perangkat, dengan versi yang sama dengan `frida-tools` di komputer
- `adb` dan Python di komputer

```bash
# 1. Pasang Frida di komputer
pip install frida-tools

# 2. Jalankan frida-server di perangkat (sebagai root)
adb shell "su -c '/data/local/tmp/frida-server &'"

# 3. Jalankan script pada aplikasi
frida -U -f com.fingersoft.hillclimb -l script.js
```

Setelah aplikasi terbuka, perhatikan nilai coins dan gems, serta iklan di bagian bawah layar.

## Rekomendasi mitigasi

1. **Deteksi Frida dan anti-tampering.** Periksa port Frida server (default 27042), file gadget, dan string `frida` pada `/proc/self/maps` saat startup.
2. **Validasi di server.** Jangan mempercayai nilai coins, gems, atau data ekonomi dari klien. Tambahkan rate limiting dan deteksi anomali.
3. **Obfuscation.** Gunakan ProGuard atau R8 untuk mempersulit reverse engineering.
4. **Root detection** dengan library seperti RootBeer.
5. **Uji keamanan berkala** sebelum setiap rilis.

