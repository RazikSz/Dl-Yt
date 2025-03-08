---

# **📌 YouTube Downloader API**  
API ini memungkinkan pengguna mengunduh video/audio dari YouTube dengan **yt-dlp** dan **FFmpeg**.

## **🚀 Fitur:**  
✅ Download **MP3** (Audio)  
✅ Download **MP4** (Video)  
✅ **Pencarian** Video YouTube  
✅ **Mendapatkan Metadata** Video  

---

## **🔧 Persyaratan**  
Sebelum menjalankan API, pastikan server sudah memiliki:  
- **Node.js** (`v14` atau lebih tinggi)  
- **npm**  
- **Python 3** (untuk yt-dlp)  
- **yt-dlp**  
- **FFmpeg**  

---

## **📥 Instalasi & Menjalankan API**  

### **1️⃣ Clone Repository (Opsional)**
```sh
git clone https://github.com/RyzenOfc/yt-downloader-api.git
cd yt-downloader-api
```
Atau upload file manual ke server.

---

### **2️⃣ Install Node.js dan npm**  
Cek apakah sudah terinstall:  
```sh
node -v
npm -v
```
Jika belum, install dengan:  
```sh
apt update && apt install nodejs npm -y  # Untuk Ubuntu/Debian
```

---

### **3️⃣ Install yt-dlp & FFmpeg**
**Install Python & yt-dlp:**  
```sh
apt install python3-pip -y
pip3 install yt-dlp
```
**Install FFmpeg:**  
```sh
apt install ffmpeg -y
```
Cek apakah sudah terinstall:  
```sh
yt-dlp --version
ffmpeg -version
```

---

### **4️⃣ Install Dependencies**
Masuk ke folder proyek dan jalankan:  
```sh
npm install
```

---

### **5️⃣ Jalankan API**
```sh
node server.js
```
API akan berjalan di port `3000`.  

Cek apakah API sudah berjalan dengan membuka browser atau gunakan `curl`:  
```sh
curl http://localhost:3000
```
Jika berhasil, akan muncul JSON:  
```json
{ "message": "Hello World" }
```

---

## **💡 Menjalankan API secara Background** (Opsional)
Gunakan **PM2** agar API tetap berjalan meskipun terminal ditutup:  
```sh
npm install -g pm2
pm2 start server.js --name yt-downloader
pm2 save
```
Cek status API:  
```sh
pm2 list
```
Restart API jika perlu:  
```sh
pm2 restart yt-downloader
```

---

## **🎯 Contoh Penggunaan API**  

### **1️⃣ Download MP3**
```
GET /ytmp3?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```
Response:
```json
{
  "status": true,
  "download": "http://your-vps-ip:3000/downloads/video.mp3"
}
```

### **2️⃣ Download MP4**
```
GET /ytmp4?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### **3️⃣ Cari Video YouTube**
```
GET /search?query=rickroll
```

---

## **👨‍💻 Author**
**Nama:** ライゼン
**GitHub:** [Klik disini](https://github.com/RyzenOfc)
**YouTube:** [Klik disini](https://youtube.com/@RyzenMFK) 
**Facebook:** [Klik disini](https://www.facebook.com/algifaryz04)
**Instagram:** [Klik disini](https://www.instagram.com/algifaryz_)
**Pinterest:** [Klik disini](https://pin.it/3DuWyNxEx)

<p align="left">
  <img src="https://avatars.githubusercontent.com/u/147589149?v=4" width="100" height="100" alt="ライゼン">
</p>

---

## **🎉 Selesai!**  
Sekarang API sudah bisa digunakan! 🚀  