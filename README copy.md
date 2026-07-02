# Dokumentasi Lengkap `inventory_for_edukarya`

> Dokumentasi ini disusun untuk membantu developer, maintainer, dan reviewer memahami struktur, alur kerja, integrasi API, routing, role access, dan cara menjalankan frontend **Edukarya Inventory**.  
> Repository: `mendingNgodeng/inventory_for_edukarya`  
> Branch yang dianalisis: `staging`  
> Jenis aplikasi: **Frontend inventory management berbasis React + TypeScript + Vite**

---

## Daftar Isi

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Tech Stack](#2-tech-stack)
3. [Prasyarat](#3-prasyarat)
4. [Instalasi dan Menjalankan Project](#4-instalasi-dan-menjalankan-project)
5. [Environment Variable](#5-environment-variable)
6. [Script NPM](#6-script-npm)
7. [Struktur Folder](#7-struktur-folder)
8. [Arsitektur Aplikasi](#8-arsitektur-aplikasi)
9. [Routing](#9-routing)
10. [Autentikasi dan Otorisasi](#10-autentikasi-dan-otorisasi)
11. [Konvensi API Layer](#11-konvensi-api-layer)
12. [Daftar Endpoint Backend](#12-daftar-endpoint-backend)
13. [Modul dan Fitur Aplikasi](#13-modul-dan-fitur-aplikasi)
14. [Data Model TypeScript](#14-data-model-typescript)
15. [Reusable UI Components](#15-reusable-ui-components)
16. [Flow Utama Sistem](#16-flow-utama-sistem)
17. [Error Handling dan Toast](#17-error-handling-dan-toast)
18. [Role Access Matrix](#18-role-access-matrix)
19. [Catatan Modul Deprecated](#19-catatan-modul-deprecated)
20. [Potensi Issue dan Rekomendasi Perbaikan](#20-potensi-issue-dan-rekomendasi-perbaikan)
21. [Checklist Pengembangan](#21-checklist-pengembangan)
22. [Panduan Deployment](#22-panduan-deployment)
23. [FAQ Developer](#23-faq-developer)
24. [Glosarium](#24-glosarium)

---

## 1. Ringkasan Proyek

`inventory_for_edukarya` adalah aplikasi frontend untuk sistem inventaris Edukarya. Aplikasi ini berfungsi sebagai dashboard dan panel operasional untuk mengelola:

- Autentikasi user.
- Dashboard statistik inventaris.
- Master data inventaris:
  - Lokasi.
  - Kategori aset.
  - Tipe aset.
- Data aset.
- Stok aset.
- User/karyawan.
- Peminjaman aset.
- Pemakaian aset.
- Maintenance aset.
- Rental aset.
- Customer rental.
- Riwayat aktivitas/log aset.

Aplikasi sudah terintegrasi dengan backend `api_inventory` melalui layer API berbasis Axios.

---

## 2. Tech Stack

Project ini menggunakan stack berikut:

| Area | Teknologi |
|---|---|
| Framework UI | React |
| Bahasa | TypeScript |
| Build Tool | Vite |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Styling | Tailwind CSS |
| Icon | Lucide React |
| Form Handling | React Hook Form |
| Select Component | React Select |
| Kamera/Webcam | React Webcam |
| Toast Notification | Sonner |
| Export/Import Excel | XLSX |
| Linting | ESLint |
| Package Manager | npm |

Dependensi utama:

```json
{
  "axios": "^1.13.5",
  "lucide-react": "^0.574.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-hook-form": "^7.71.1",
  "react-router-dom": "^7.13.0",
  "react-select": "^5.10.2",
  "react-webcam": "^7.2.0",
  "sonner": "^2.0.7",
  "xlsx": "^0.18.5"
}
```

Dev dependencies penting:

```json
{
  "@vitejs/plugin-react": "^5.1.1",
  "typescript": "~5.9.3",
  "vite": "^7.3.1",
  "tailwindcss": "^4.1.18",
  "@tailwindcss/vite": "^4.1.18",
  "eslint": "^9.39.1"
}
```

---

## 3. Prasyarat

Sebelum menjalankan project, pastikan sudah tersedia:

- Node.js versi modern yang kompatibel dengan Vite 7.
- npm.
- Backend `api_inventory` berjalan.
- Base URL backend tersedia.
- Browser modern.

Disarankan:

```bash
node -v
npm -v
```

---

## 4. Instalasi dan Menjalankan Project

### 4.1 Clone Repository

```bash
git clone https://github.com/mendingNgodeng/inventory_for_edukarya.git
cd inventory_for_edukarya
git checkout staging
```

### 4.2 Install Dependency

```bash
npm install
```

### 4.3 Buat File `.env`

Copy file `.env.example` menjadi `.env`.

```bash
cp .env.example .env
```

Isi default:

```env
VITE_URL_API="http://localhost:3000"
```

Sesuaikan dengan URL backend.

Contoh production/staging:

```env
VITE_URL_API="https://api-domain-anda.com"
```

### 4.4 Jalankan Development Server

```bash
npm run dev
```

Biasanya Vite akan berjalan di:

```text
http://localhost:5173
```

### 4.5 Build Production

```bash
npm run build
```

### 4.6 Preview Build

```bash
npm run preview
```

### 4.7 Start untuk Hosting dengan `$PORT`

Project memiliki script:

```bash
npm run start
```

Script ini menjalankan:

```bash
vite preview --host 0.0.0.0 --port $PORT
```

Ini cocok untuk platform hosting yang menyediakan environment variable `PORT`.

---

## 5. Environment Variable

File `.env.example` hanya berisi satu konfigurasi:

```env
VITE_URL_API="http://localhost:3000"
```

### 5.1 Penjelasan

| Variable | Fungsi |
|---|---|
| `VITE_URL_API` | Base URL backend API yang akan digunakan Axios. |

### 5.2 Penggunaan di Kode

File:

```text
src/api/client.ts
```

mengambil variable tersebut:

```ts
const BASE_URL = import.meta.env.VITE_URL_API;
```

Lalu digunakan sebagai `baseURL` untuk:

- `publicClient`
- `privateClient`

---

## 6. Script NPM

Di `package.json`, script yang tersedia:

| Script | Command | Fungsi |
|---|---|---|
| `dev` | `vite` | Menjalankan development server |
| `build` | `tsc -b && vite build` | Type check + build production |
| `lint` | `eslint .` | Menjalankan lint |
| `preview` | `vite preview` | Preview hasil build |
| `start` | `vite preview --host 0.0.0.0 --port $PORT` | Start app untuk deployment yang memakai port environment |

---

## 7. Struktur Folder

Struktur utama repository:

```text
inventory_for_edukarya/
├─ public/
├─ src/
│  ├─ api/
│  ├─ app/
│  ├─ assets/
│  ├─ components/
│  ├─ features/
│  ├─ layouts/
│  ├─ App.css
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ .env.example
├─ .gitignore
├─ FRONTEND_ARCHITECTURE_AND_FLOWS.md
├─ FRONTEND_CODE_EXPLANATION.md
├─ README.md
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

### 7.1 Struktur `src/api`

```text
src/api/
├─ MaintenanceAssets/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ UseAssets/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ assetCategories/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ assetLogs/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ assetTypes/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ assets/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ assetsStock/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ auth/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ divisi/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ location/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ rental_asset/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ rental_customer/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ statistic/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ user/
│  ├─ hooks.ts
│  ├─ service.ts
│  └─ types.ts
├─ client.ts
└─ endpoints.ts
```

### 7.2 Struktur `src/app`

```text
src/app/
├─ protectedRoute.tsx
└─ router.tsx
```

### 7.3 Struktur `src/components`

```text
src/components/
├─ helper/
├─ ui/
├─ Navbar.tsx
└─ Sidebar.tsx
```

### 7.4 Struktur `src/features`

```text
src/features/
├─ AssetType/
├─ Assets/
├─ AssetsStock/
├─ Divisi/
├─ assetCategories/
├─ assetLogs/
├─ borrowAssets/
├─ dashboard/
├─ locations/
├─ login/
├─ maintenanceAssets/
├─ rental/
├─ useAssets/
├─ user/
└─ notFound.tsx
```

### 7.5 Struktur `src/layouts`

```text
src/layouts/
├─ AuthLayout.tsx
├─ Dashboardlayout.tsx
├─ Dashboardlayout1.tsx
└─ PublicLayout.tsx
```

---

## 8. Arsitektur Aplikasi

Aplikasi menggunakan pendekatan modular berbasis fitur.

### 8.1 Layer Utama

```text
UI Page / Feature
     ↓
Custom Hook
     ↓
Service API
     ↓
Axios Client
     ↓
Backend API
```

Contoh flow modul aset:

```text
src/features/Assets/pages/Page.tsx
     ↓ menggunakan
src/api/assets/hooks.ts
     ↓ memanggil
src/api/assets/service.ts
     ↓ menggunakan
src/api/client.ts
     ↓ request ke
/api/asset
```

### 8.2 Pola Feature

Setiap fitur utama biasanya memiliki:

- Page
- Table
- Modal
- Types lokal UI
- Hook API
- Service API
- Types API

Contoh:

```text
src/features/Assets/pages/Page.tsx
src/features/Assets/pages/Table.tsx
src/features/Assets/pages/Modal.tsx
src/features/Assets/pages/Types.ts

src/api/assets/hooks.ts
src/api/assets/service.ts
src/api/assets/types.ts
```

### 8.3 Keuntungan Arsitektur

- File UI tidak perlu tahu detail endpoint.
- Logic request dipusatkan di service.
- State data dipusatkan di hook.
- Komponen halaman fokus pada:
  - Search.
  - Modal.
  - Submit.
  - Delete confirmation.
  - Render table/card.

---

## 9. Routing

Routing didefinisikan di:

```text
src/app/router.tsx
```

Aplikasi menggunakan `createBrowserRouter` dari `react-router-dom`.

### 9.1 Route Publik

| Path | Komponen | Keterangan |
|---|---|---|
| `/login` | `Login` | Halaman login |
| `*` | `NotFoundPage` | Halaman fallback 404 |

### 9.2 Route Protected

Route protected dibungkus oleh:

```tsx
<ProtectedRoute />
```

Lalu masuk ke layout:

```tsx
<Dashboardlayout />
```

### 9.3 Daftar Route Dashboard

| Path | Komponen | Fungsi |
|---|---|---|
| `/` | `DashboardPage` | Default dashboard |
| `/dashboard` | `DashboardPage` | Dashboard statistik |
| `/maintenance-assets` | `MaintenanceAssets` | Maintenance aset |
| `/use-assets` | `UseAssets` | Pemakaian barang/aset |
| `/locations` | `LocationPage` | Master lokasi |
| `/asset-categories` | `AssetCategoryPage` | Master kategori aset |
| `/asset-types` | `AssetTypePage` | Master tipe aset |
| `/user-karyawan` | `User` | Manajemen user/karyawan |
| `/asset` | `Asset` | Master aset |
| `/asset-stock` | `AssetStock` | Stok aset |
| `/rental` | `Rental` | Rental aset |
| `/assetLogs` | `AssetLogs` | Riwayat/log aset |
| `/divisi` | `Divisi` | Modul divisi, tetapi ditandai deprecated di dokumentasi repo |
| `/borrow-assets` | `Borrowassets` | Peminjaman aset |

---

## 10. Autentikasi dan Otorisasi

### 10.1 File Terkait

```text
src/api/auth/service.ts
src/api/auth/hooks.ts
src/api/auth/types.ts
src/app/protectedRoute.tsx
src/api/client.ts
```

### 10.2 Login

Login menggunakan endpoint:

```text
POST /auth/login
```

Payload login:

```ts
export interface LoginRequest {
  identifier: string;
  password: string;
}
```

Di UI login, field `username` dikirim sebagai `identifier`.

```ts
await login({
  identifier: form.username,
  password: form.password,
});
```

### 10.3 Response Login

```ts
export interface LoginResponse {
  message: string;
  user: user;
  token: string;
}
```

Setelah login berhasil:

- `token` disimpan ke `localStorage` dengan key `token`.
- Data user disimpan ke `localStorage` dengan key `user`.
- Password dikeluarkan dari object user sebelum disimpan.
- User diarahkan ke `/dashboard`.

### 10.4 Logout

Logout menggunakan endpoint:

```text
POST /auth/logout
```

Setelah logout:

- `token` dihapus dari `localStorage`.
- `user` dihapus dari `localStorage`.
- User diarahkan ke `/login`.

### 10.5 Protected Route

File:

```text
src/app/protectedRoute.tsx
```

Fungsi:

1. Mengecek token di `localStorage`.
2. Jika token tidak ada, user diarahkan ke login.
3. Mengecek object user.
4. Jika user tidak valid, token dihapus.
5. Membatasi akses berdasarkan role.

### 10.6 Role yang Terdeteksi

Role yang digunakan:

- `ADMIN`
- `KARYAWAN`

### 10.7 Akses Role `KARYAWAN`

Di `ProtectedRoute`, role `KARYAWAN` hanya boleh mengakses:

```ts
const karyawanAllowedPaths = ["/dashboard", "/borrow-assets"];
```

Artinya, karyawan tidak boleh mengakses fitur admin seperti master data, stok, user, rental, dan logs.

---

## 11. Konvensi API Layer

### 11.1 Axios Client

File:

```text
src/api/client.ts
```

Terdapat dua Axios instance:

```ts
publicClient
privateClient
```

#### `publicClient`

Digunakan untuk request publik, misalnya login.

#### `privateClient`

Digunakan untuk request yang membutuhkan token.

### 11.2 Inject Bearer Token

`privateClient` otomatis mengambil token dari `localStorage`.

```ts
privateClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 11.3 Global Response Error Handler

Global handler menangani:

| HTTP Status | Behavior |
|---|---|
| `429` | Toast error rate limit, menampilkan retry delay |
| `401` | Hapus token & user, tampilkan toast session expired |
| `>=500` | Toast error server |

### 11.4 Pola Service

Contoh service standar:

```ts
export class dataService {
  static async getAll(): Promise<data[]> {
    const { data } = await privateClient.get<ApiResponse<data[]>>(ENDPOINTS.ASSETS);
    return data.data;
  }

  static async getById(id: number): Promise<data> {
    const { data } = await privateClient.get<ApiResponse<data>>(`${ENDPOINTS.ASSETS}/${id}`);
    return data.data;
  }

  static async create(payload: CreateData): Promise<data> {
    const { data } = await privateClient.post<ApiResponse<data>>(ENDPOINTS.ASSETS, payload);
    return data.data;
  }

  static async update(id: number, payload: UpdateData): Promise<data> {
    const { data } = await privateClient.put<ApiResponse<data>>(`${ENDPOINTS.ASSETS}/${id}`, payload);
    return data.data;
  }

  static async delete(id: number): Promise<void> {
    await privateClient.delete(`${ENDPOINTS.ASSETS}/${id}`);
  }
}
```

### 11.5 Pola Hook

Contoh hook standar:

```ts
export const useData = () => {
  const [Data, setData] = useState<data[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await dataService.getAll();
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    Data,
    loading,
    fetchData,
    createData,
    updateData,
    deleteData,
  };
};
```

---

## 12. Daftar Endpoint Backend

Endpoint dipusatkan di:

```text
src/api/endpoints.ts
```

```ts
export const ENDPOINTS = {
  LOCATION: "/location",
  CATEGORIES: "/assetCtg",
  TYPES: "/assetTypes",
  ASSETS: "/asset",
  USER: "/user",
  RENTAL_CUSTOMER: "/rentalCustomer",
  ASSET_STOCK: "/assetStock",
  ASSET_USE: "/assetBorrow",
  ASSET_MAINTENANCE: "/assetMaintenance",
  ASSET_RENTAL: "/assetRental",
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",
  ASSET_LOGS: "/assetLogs",
  DIVISI: "/divisi",
  STATISTIC: "/statistic/getDashboardSummary",
  CTGRANK: "/statistic/rankCtgByStock",
  GET5LOGS: "/statistic/get5LatestLogs",
  RENTAL_SUMMARY: "/statistic/rentalSummary",
  BORROW_SUMMARY: "/statistic/BorrowSummary",
};
```

### 12.1 Mapping Endpoint ke Modul

| Modul | Endpoint | Fungsi |
|---|---|---|
| Auth Login | `/auth/login` | Login |
| Auth Logout | `/auth/logout` | Logout |
| Location | `/location` | CRUD lokasi |
| Asset Categories | `/assetCtg` | CRUD kategori aset |
| Asset Types | `/assetTypes` | CRUD tipe aset |
| Assets | `/asset` | CRUD master aset |
| User | `/user` | CRUD user/karyawan dan create many |
| Rental Customer | `/rentalCustomer` | CRUD customer rental |
| Asset Stock | `/assetStock` | CRUD stok aset |
| Asset Borrow/Use | `/assetBorrow` | Peminjaman, pemakaian, pengembalian |
| Asset Maintenance | `/assetMaintenance` | Maintenance aset |
| Asset Rental | `/assetRental` | Rental aset |
| Asset Logs | `/assetLogs` | Log aktivitas aset |
| Divisi | `/divisi` | Modul lama/deprecated |
| Statistic Summary | `/statistic/getDashboardSummary` | Summary dashboard |
| Category Ranking | `/statistic/rankCtgByStock` | Ranking kategori berdasarkan stok |
| Latest Logs | `/statistic/get5LatestLogs` | 5 log terbaru |
| Rental Summary | `/statistic/rentalSummary` | Summary rental |
| Borrow Summary | `/statistic/BorrowSummary` | Summary peminjaman/pemakaian |

---

## 13. Modul dan Fitur Aplikasi

### 13.1 Login

Folder:

```text
src/features/login/
```

File utama:

```text
src/features/login/pages/login.tsx
```

Fitur:

- Input username.
- Input password.
- Validasi field wajib.
- Submit login ke `useAuth`.
- Menampilkan error login.
- Setelah berhasil login, diarahkan ke `/dashboard`.

Teks halaman login:

```text
Sistem Inventaris Edukarya
Masuk sebagai admin untuk mengelola inventaris
```

---

### 13.2 Dashboard

Folder:

```text
src/features/dashboard/
src/api/statistic/
```

Route:

```text
/dashboard
/
```

Hook:

```text
useDashboard()
```

Service:

```text
dashboardService
```

Data yang diambil secara paralel:

- Summary dashboard.
- Ranking kategori berdasarkan stok.
- 5 log terbaru.
- Borrow summary.
- Rental summary.

Endpoint:

```text
GET /statistic/getDashboardSummary
GET /statistic/rankCtgByStock
GET /statistic/get5LatestLogs
GET /statistic/BorrowSummary
GET /statistic/rentalSummary
```

Komponen dashboard yang digunakan:

- `LoadingState`
- `ErrorState`
- `StatsGrid`
- `RecentActivities`
- `CategoryRanking`
- `FooterStats`

---

### 13.3 Master Lokasi

Folder:

```text
src/features/locations/
src/api/location/
```

Route:

```text
/locations
```

Endpoint:

```text
GET    /location
GET    /location/:id
POST   /location
PUT    /location/:id
DELETE /location/:id
```

Data model:

```ts
export interface Location {
  id_location: number;
  name: string;
  description: string;
}
```

Fitur UI:

- Tabel lokasi.
- Search berdasarkan `name`.
- Tambah lokasi.
- Edit lokasi.
- Hapus lokasi dengan confirmation alert.
- Toast success/error.

Error delete yang ditangani:

```text
Gagal menghapus lokasi. data ini masih digunakan oleh tabel lain!
```

---

### 13.4 Master Tipe Aset

Folder:

```text
src/features/AssetType/
src/api/assetTypes/
```

Route:

```text
/asset-types
```

Endpoint:

```text
GET    /assetTypes
GET    /assetTypes/:id
POST   /assetTypes
PUT    /assetTypes/:id
DELETE /assetTypes/:id
```

Data model:

```ts
export interface data {
  id_asset_types: number;
  name: string;
  description: string;
}
```

Fitur UI:

- Search tipe aset berdasarkan nama.
- Tambah tipe aset.
- Edit tipe aset.
- Delete dengan alert.
- Toast feedback.

---

### 13.5 Master Kategori Aset

Folder:

```text
src/features/assetCategories/
src/api/assetCategories/
```

Route:

```text
/asset-categories
```

Endpoint:

```text
GET    /assetCtg
GET    /assetCtg/:id
POST   /assetCtg
PUT    /assetCtg/:id
DELETE /assetCtg/:id
```

Data model:

```ts
export interface data {
  id_asset_categories: number;
  name: string;
  description: string;
}
```

Fitur UI:

- Search kategori berdasarkan nama.
- Tambah kategori.
- Edit kategori.
- Hapus kategori dengan konfirmasi.
- Toast feedback.

---

### 13.6 Master Aset

Folder:

```text
src/features/Assets/
src/api/assets/
```

Route:

```text
/asset
```

Endpoint:

```text
GET    /asset
GET    /asset/:id
POST   /asset
PUT    /asset/:id
DELETE /asset/:id
```

Data model utama:

```ts
export interface data {
  id_assets: number;
  id_asset_types: number;
  id_asset_categories: number;
  purchase_price: number;
  rental_price: number;
  asset_name: string;
  asset_code: string;
  type: {
    name: string;
  };
  category: {
    name: string;
  };
  is_rentable: boolean;
  created_at: string;
  updated_at: string;
}
```

Field create:

```ts
export interface CreateData {
  id_asset_types: number;
  id_asset_categories: number;
  purchase_price: number;
  rental_price: number;
  asset_name: string;
  asset_code: string;
  is_rentable: boolean;
  created_at: string;
  updated_at: string;
}
```

Fitur UI:

- Search berdasarkan:
  - Nama aset.
  - Kode aset.
  - Kategori.
  - Tipe.
  - Harga beli.
- Tambah aset.
- Edit aset.
- Delete dengan konfirmasi.
- Integrasi data tipe aset dan kategori aset untuk relasi.

---

### 13.7 Stok Aset

Folder:

```text
src/features/AssetsStock/
src/api/assetsStock/
```

Route:

```text
/asset-stock
```

Endpoint:

```text
GET    /assetStock
GET    /assetStock/:id
POST   /assetStock
PUT    /assetStock/:id
DELETE /assetStock/:id
```

Data model:

```ts
export interface data {
  id_asset_stock: number;
  id_asset: number;
  id_location: number;
  condition: string;
  quantity: number;
  status: string;
  asset: {
    asset_name: string;
    asset_code: string;
    rental_price: number;
    is_rentable: boolean;
    type: {
      name: string;
    };
    category: {
      name: string;
    };
  };
  location: {
    name: string;
  };
  created_at: string;
  updated_at: string;
}
```

Field create:

```ts
export interface CreateData {
  id_asset: number;
  id_location: number;
  condition: string;
  quantity: number;
}
```

Fitur UI:

- Search berdasarkan:
  - Nama aset.
  - Kode aset.
  - Quantity.
  - Kategori.
  - Tipe.
  - Status.
- Tambah stok aset.
- Edit stok aset.
- Delete stok aset.
- Error delete memakai message dari backend jika tersedia.

---

### 13.8 User/Karyawan

Folder:

```text
src/features/user/
src/api/user/
```

Route:

```text
/user-karyawan
```

Endpoint:

```text
GET    /user
GET    /user/:id
POST   /user
POST   /user/many
PUT    /user/:id
DELETE /user/:id
```

Data model:

```ts
export interface data {
  id_user: number;
  name: string;
  username: string;
  password: string;
  role: string;
  jabatan?: string;
  no_hp?: string;
}
```

Field create:

```ts
export interface CreateData {
  name: string;
  username: string;
  password: string;
  role: string;
  jabatan?: string;
  no_hp?: string;
}
```

Fitur UI:

- Search berdasarkan:
  - Nama.
  - Jabatan.
  - Nomor HP.
- Tambah user.
- Edit user.
- Hapus user.
- Tambah banyak user sekaligus melalui `createManyUsers`.
- Toast ketika banyak user berhasil ditambahkan.

---

### 13.9 Pinjam Aset

Folder:

```text
src/features/borrowAssets/
src/api/UseAssets/
```

Route:

```text
/borrow-assets
```

Endpoint service:

```text
GET    /assetBorrow
GET    /assetBorrow/:id
POST   /assetBorrow/borrow
POST   /assetBorrow/used
PUT    /assetBorrow/:id/return
DELETE /assetBorrow/:id
```

Untuk fitur pinjam, method utama:

```ts
createBorrow(payload)
updateData(id, payload)
```

Data model:

```ts
export interface data {
  id_asset_borrowed: number;
  id_asset_stock: number;
  id_user: any;
  quantity: number;
  borrowed_date: string;
  returned_date: string;
  status: string;
  assetStock: {
    asset: {
      asset_name: string;
      asset_code: string;
    };
    location: {
      name: string;
    };
  };
  user: {
    name: string;
    jabatan: string;
    no_hp: string;
  };
}
```

Fitur UI:

- List stok tersedia untuk dipinjam.
- Search berdasarkan:
  - Nama aset.
  - Kode aset.
  - Lokasi.
  - Nama user.
- Tab:
  - `STOCK`
  - `ACTIVE` khusus admin.
  - `OWN` untuk user login.
  - `RETURNED`
- Role-aware behavior:
  - Admin dapat melihat semua peminjaman aktif.
  - Karyawan melihat peminjaman miliknya sendiri.
- Modal pinjam aset.
- Modal pengembalian aset.
- Refetch stok dan data borrow setelah aksi sukses.

---

### 13.10 Pakai Aset

Folder:

```text
src/features/useAssets/
src/api/UseAssets/
```

Route:

```text
/use-assets
```

Endpoint:

```text
POST /assetBorrow/used
PUT  /assetBorrow/:id/return
```

Fitur UI:

- List stok aset.
- Tab:
  - `STOCK`
  - `ACTIVE`
  - `RETURNED`
- Search berdasarkan:
  - Nama aset.
  - Kode aset.
  - Lokasi.
- Membuat catatan pemakaian aset.
- Mengembalikan aset.
- Refetch stok dan borrow/use data setelah aksi.

Status yang digunakan:

```text
DIPAKAI
DIKEMBALIKAN
```

---

### 13.11 Maintenance Aset

Folder:

```text
src/features/maintenanceAssets/
src/api/MaintenanceAssets/
```

Route:

```text
/maintenance-assets
```

Endpoint:

```text
GET    /assetMaintenance
GET    /assetMaintenance/:id
POST   /assetMaintenance
PUT    /assetMaintenance/:id
PUT    /assetMaintenance/:id/return
DELETE /assetMaintenance/:id
```

Data model:

```ts
export interface data {
  id_asset_maintenance: number;
  id_asset_stock: number;
  quantity: number;
  cost: number;
  created_at: string;
  updated_at: string;
  description: string;
  status: string;
  assetStock: {
    asset: {
      asset_name: string;
      asset_code: string;
    };
    location: {
      name: string;
    };
  };
}
```

Field create:

```ts
export interface CreateData {
  id_asset_stock: number;
  cost: number;
  quantity: number;
  description: string;
}
```

Fitur UI:

- List stok aset untuk maintenance.
- Membuat data maintenance.
- Menandai maintenance selesai/return.
- Tab:
  - `STOCK`
  - `ACTIVE`
  - `RETURNED`
- Status:
  - `ON_PROGRESS`
  - `DONE`

---

### 13.12 Rental Aset

Folder:

```text
src/features/rental/
src/api/rental_asset/
src/api/rental_customer/
```

Route:

```text
/rental
```

Modul rental terdiri dari:

1. Customer rental.
2. Rental aktif.
3. Stok yang bisa dirental.
4. History rental.

#### 13.12.1 Customer Rental

Endpoint:

```text
GET    /rentalCustomer
GET    /rentalCustomer/:id
POST   /rentalCustomer
PUT    /rentalCustomer/:id
DELETE /rentalCustomer/:id
```

Data model:

```ts
export interface data {
  id_rental_customer: number;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
  pictureKtp: string;
}
```

Field create:

```ts
export interface CreateData {
  name: string;
  phone: string;
  pictureKtp: string;
}
```

#### 13.12.2 Rental Asset

Endpoint:

```text
GET    /assetRental
GET    /assetRental/:id
POST   /assetRental
PUT    /assetRental/:id
PUT    /assetRental/:id/finish
PUT    /assetRental/:id/pay
PUT    /assetRental/:id/cancel
DELETE /assetRental/:id
DELETE /assetRental/nonActive
```

Data model:

```ts
export type RentalStatus = "AKTIF" | "SELESAI" | "DIBATALKAN";
export type PaymentStatus = "DP" | "BELUM_BAYAR" | "LUNAS";

export interface data {
  id_asset_rental: number;
  id_rental_customer: number;
  id_asset_stock: number;
  quantity: number;
  rental_start: string;
  rental_end: string;
  price: number;
  dp_amount: number;
  remaining_amount: number;
  status: RentalStatus;
  payment_status: PaymentStatus;
  image_after_rental?: string | null;
  assetStock?: AssetStockLite;
  customer?: RentalCustomerLite;
}
```

Field create:

```ts
export interface CreateData {
  id_rental_customer: number;
  id_asset_stock: number;
  quantity: number;
  rental_start: string;
  rental_end: string;
  dp_amount: number;
  status?: RentalStatus;
}
```

Payload finish rental:

```ts
export interface FinishPayload {
  image_after_rental?: string;
}
```

Payload pembayaran rental:

```ts
export interface PayRentalPayload {
  payment_amount: number;
  payment_note?: string;
}
```

Fitur UI:

- Tab `CUSTOMER`
- Tab `RENTAL_BY_CUSTOMER`
- Tab `RENTABLE_STOCK`
- Tab `HISTORY`
- Search global.
- Filter stok rentable:
  - `asset.is_rentable === true`
  - `status === "TERSEDIA"`
  - `condition === "BAIK"`
  - `quantity > 0`
- Finish rental.
- Pay rental.
- Cancel rental.
- Delete rental non-active.

---

### 13.13 Asset Logs

Folder:

```text
src/features/assetLogs/
src/api/assetLogs/
```

Route:

```text
/assetLogs
```

Endpoint:

```text
GET /assetLogs
GET /assetLogs/:id
GET /assetLogs/:group
```

Group yang didukung:

```ts
export type AssetLogGroup =
  | "all"
  | "location"
  | "rental-customer"
  | "user"
  | "asset"
  | "asset-stock"
  | "types"
  | "categories"
  | "rental"
  | "borrow"
  | "maintenance"
  | "delete-history"
  | "other";
```

Action log:

```ts
export type AssetLogAction =
  | "ASSET_STOCK_UPDATE"
  | "ASSET_STOCK_CREATE"
  | "ASSET_STOCK_DELETE"
  | "ASSET_UPDATE"
  | "ASSET_CREATE"
  | "ASSET_DELETE"
  | "ASSET_CATEGORIES_UPDATE"
  | "ASSET_CATEGORIES_CREATE"
  | "ASSET_CATEGORIES_DELETE"
  | "USER(KARYAWAN)_UPDATE"
  | "USER(KARYAWAN)_CREATE"
  | "USER(KARYAWAN)_DELETE"
  | "RENTAL_CUSTOMER_UPDATE"
  | "RENTAL_CUSTOMER_CREATE"
  | "RENTAL_CUSTOMER_DELETE"
  | "ASSET_TYPE_UPDATE"
  | "ASSET_TYPE_CREATE"
  | "ASSET_TYPE_DELETE"
  | "LOCATION_UPDATE"
  | "LOCATION_CREATE"
  | "LOCATION_DELETE"
  | "BORROW_CREATE"
  | "BORROW_RETURN"
  | "BORROW_CANCEL"
  | "USED_CREATE"
  | "USED_RETURN"
  | "RENTAL_CREATE"
  | "RENTAL_FINISH"
  | "RENTAL_CANCEL"
  | "MAINTENANCE_CREATE"
  | "MAINTENANCE_DONE"
  | "STOCK_UPDATE"
  | "STOCK_MOVE"
  | "DELETE_HISTORY"
  | "OTHER";
```

Fitur UI:

- Lazy fetch berdasarkan tab.
- Search berdasarkan:
  - Action.
  - Description.
  - Created at.
- Tab log:
  - All.
  - Asset stock.
  - User.
  - Rental customer.
  - Categories.
  - Types.
  - Location.
  - Asset.
  - Rental.
  - Borrow.
  - Maintenance.

---

### 13.14 Not Found Page

File:

```text
src/features/notFound.tsx
```

Route:

```text
*
```

Menampilkan halaman 404 dengan tombol:

- Kembali ke dashboard.
- Kembali ke halaman sebelumnya.

Teks utama:

```text
404
Kamu siapa? Dimana rumahnya?
Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
```

---

## 14. Data Model TypeScript

### 14.1 Auth

```ts
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface user {
  id_user: number;
  username: string;
  name: string;
  password: string;
  role: "ADMIN" | string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  user: user;
  token: string;
}
```

### 14.2 Location

```ts
export interface Location {
  id_location: number;
  name: string;
  description: string;
}
```

### 14.3 Asset Category

```ts
export interface data {
  id_asset_categories: number;
  name: string;
  description: string;
}
```

### 14.4 Asset Type

```ts
export interface data {
  id_asset_types: number;
  name: string;
  description: string;
}
```

### 14.5 Asset

```ts
export interface data {
  id_assets: number;
  id_asset_types: number;
  id_asset_categories: number;
  purchase_price: number;
  rental_price: number;
  asset_name: string;
  asset_code: string;
  type: {
    name: string;
  };
  category: {
    name: string;
  };
  is_rentable: boolean;
  created_at: string;
  updated_at: string;
}
```

### 14.6 Asset Stock

```ts
export interface data {
  id_asset_stock: number;
  id_asset: number;
  id_location: number;
  condition: string;
  quantity: number;
  status: string;
  asset: {
    asset_name: string;
    asset_code: string;
    rental_price: number;
    is_rentable: boolean;
    type: {
      name: string;
    };
    category: {
      name: string;
    };
  };
  location: {
    name: string;
  };
  created_at: string;
  updated_at: string;
}
```

### 14.7 Borrow/Use Asset

```ts
export interface data {
  id_asset_borrowed: number;
  id_asset_stock: number;
  id_user: any;
  quantity: number;
  borrowed_date: string;
  returned_date: string;
  status: string;
  assetStock: {
    asset: {
      asset_name: string;
      asset_code: string;
    };
    location: {
      name: string;
    };
  };
  user: {
    name: string;
    jabatan: string;
    no_hp: string;
  };
}
```

### 14.8 Maintenance Asset

```ts
export interface data {
  id_asset_maintenance: number;
  id_asset_stock: number;
  quantity: number;
  cost: number;
  created_at: string;
  updated_at: string;
  description: string;
  status: string;
  assetStock: {
    asset: {
      asset_name: string;
      asset_code: string;
    };
    location: {
      name: string;
    };
  };
}
```

### 14.9 Rental Customer

```ts
export interface data {
  id_rental_customer: number;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
  pictureKtp: string;
}
```

### 14.10 Rental Asset

```ts
export type RentalStatus = "AKTIF" | "SELESAI" | "DIBATALKAN";
export type PaymentStatus = "DP" | "BELUM_BAYAR" | "LUNAS";

export interface data {
  id_asset_rental: number;
  id_rental_customer: number;
  id_asset_stock: number;
  quantity: number;
  rental_start: string;
  rental_end: string;
  price: number;
  dp_amount: number;
  remaining_amount: number;
  status: RentalStatus;
  payment_status: PaymentStatus;
  image_after_rental?: string | null;
  assetStock?: AssetStockLite;
  customer?: RentalCustomerLite;
}
```

### 14.11 User/Karyawan

```ts
export interface data {
  id_user: number;
  name: string;
  username: string;
  password: string;
  role: string;
  jabatan?: string;
  no_hp?: string;
}
```

### 14.12 Dashboard Statistic

```ts
export interface DashboardSummary {
  total_asset: number;
  total_user: number;
  total_category: number;
  total_used_asset: number;
  total_maintenance_asset: number;
}

export interface CtgRankByStock {
  id_asset_categories: number;
  name: string;
  total_stock: number;
}

export interface BorrowSummaryBucket {
  total_qty: number;
  total_row: number;
}

export interface BorrowSummary {
  dipinjam_aktif: BorrowSummaryBucket;
  dipakai_aktif: BorrowSummaryBucket;
  returned_today: BorrowSummaryBucket & {
    day_start: string;
  };
}

export interface RentalSummary {
  aktif_count: number;
  selesai_count: number;
  dibatalkan_count: number;
  revenue_month: number;
  revenue_total: number;
  month_start: string;
}
```

---

## 15. Reusable UI Components

Folder:

```text
src/components/ui/
```

Komponen yang terlihat digunakan di berbagai halaman:

| Komponen | Fungsi |
|---|---|
| `button.tsx` | Tombol reusable dengan variasi style |
| `input.tsx` | Input standar |
| `alert.tsx` | Dialog konfirmasi, terutama delete |
| `pagination.tsx` | Pagination grid/tabel |
| Modal reusable/lokal | Form create/update atau aksi khusus |
| Table reusable/lokal | Render data tiap fitur |
| Toaster Sonner | Toast global |

### 15.1 Navbar

File:

```text
src/components/Navbar.tsx
```

Fungsi:

- Toggle sidebar di mobile.
- Search bar desktop/mobile.
- Tampilkan nama dan role user jika login.
- Tombol login jika belum auth.
- Dropdown profil.
- Logout.

### 15.2 Sidebar

File:

```text
src/components/Sidebar.tsx
```

Fungsi:

- Navigasi utama dashboard.
- Filter menu berdasarkan role.
- Group menu `Data Master`.
- Highlight menu aktif.
- Tampilkan avatar sederhana dari huruf awal username.

Menu utama:

| Menu | Path | Role |
|---|---|---|
| Dashboard | `/dashboard` | ADMIN, KARYAWAN |
| Pinjam Barang | `/borrow-assets` | ADMIN, KARYAWAN |
| Data Master > Tipe Aset | `/asset-types` | ADMIN |
| Data Master > Kategori Aset | `/asset-categories` | ADMIN |
| Data Master > Lokasi | `/locations` | ADMIN |
| List Karyawan | `/user-karyawan` | ADMIN |
| List Aset | `/asset` | ADMIN |
| List Stock Aset | `/asset-stock` | ADMIN |
| Rental | `/rental` | ADMIN |
| Pakai Barang | `/use-assets` | ADMIN |
| Barang Rusak | `/maintenance-assets` | ADMIN |
| Logs Data Aset | `/assetLogs` | ADMIN |

### 15.3 Dashboard Layout

File:

```text
src/layouts/Dashboardlayout1.tsx
```

Fungsi:

- Membungkus halaman authenticated.
- Memuat Sidebar.
- Memuat Navbar.
- Memuat `Outlet` dari React Router.
- Mengatur responsive sidebar:
  - Desktop: sidebar terbuka.
  - Mobile: sidebar bisa toggle dan overlay.

---

## 16. Flow Utama Sistem

### 16.1 Flow Login

```text
User membuka /login
        ↓
Mengisi username + password
        ↓
LoginPage memanggil useAuth.login()
        ↓
authService.login() mengirim POST /auth/login
        ↓
Backend mengembalikan token + user
        ↓
Token disimpan di localStorage
        ↓
User disimpan di localStorage tanpa password
        ↓
Navigate ke /dashboard
```

### 16.2 Flow Protected Page

```text
User membuka route protected
        ↓
ProtectedRoute cek token
        ↓
Jika token tidak ada → redirect login
        ↓
Cek object user
        ↓
Jika role KARYAWAN dan path tidak diizinkan → redirect ke /borrow-assets
        ↓
Render Dashboardlayout
        ↓
Render page melalui Outlet
```

### 16.3 Flow CRUD Master Data

Contoh master lokasi:

```text
User membuka /locations
        ↓
LocationPage mount
        ↓
useLocations() berjalan
        ↓
fetchLocations()
        ↓
LocationService.getAll()
        ↓
GET /location
        ↓
Data masuk ke state locations
        ↓
Table render data
```

Create/update:

```text
Klik Tambah/Edit
        ↓
Modal dibuka
        ↓
Submit form
        ↓
createLocation() / updateLocation()
        ↓
POST atau PUT ke backend
        ↓
State lokal diperbarui
        ↓
Toast sukses
        ↓
Modal ditutup
```

Delete:

```text
Klik delete
        ↓
Alert konfirmasi muncul
        ↓
User confirm
        ↓
DELETE /endpoint/:id
        ↓
State lokal difilter
        ↓
Toast sukses/error
```

### 16.4 Flow Borrow Asset

```text
User membuka /borrow-assets
        ↓
Load asset stock + borrow data
        ↓
User memilih stok
        ↓
Modal pinjam terbuka
        ↓
Submit peminjaman
        ↓
POST /assetBorrow/borrow
        ↓
Refetch stok dan data borrow
        ↓
Data aktif/own/returned diperbarui
```

### 16.5 Flow Use Asset

```text
Admin membuka /use-assets
        ↓
Load stock + use/borrow data
        ↓
Admin memilih asset stock
        ↓
Submit pemakaian
        ↓
POST /assetBorrow/used
        ↓
Status menjadi DIPAKAI
        ↓
Return asset via PUT /assetBorrow/:id/return
        ↓
Status menjadi DIKEMBALIKAN
```

### 16.6 Flow Maintenance Asset

```text
Admin membuka /maintenance-assets
        ↓
Load stock + maintenance data
        ↓
Admin memilih stock rusak/maintenance
        ↓
POST /assetMaintenance
        ↓
Status maintenance ON_PROGRESS
        ↓
Ketika selesai
        ↓
PUT /assetMaintenance/:id/return
        ↓
Status DONE
```

### 16.7 Flow Rental Asset

```text
Admin membuka /rental
        ↓
Load customers + rentals + stocks
        ↓
Customer bisa dibuat/diedit/dihapus
        ↓
Admin memilih rentable stock
        ↓
POST /assetRental
        ↓
Rental aktif
        ↓
Admin dapat:
  - pay rental
  - finish rental
  - cancel rental
        ↓
Data rental dan stok direfresh
```

### 16.8 Flow Asset Logs

```text
Admin membuka /assetLogs
        ↓
Default tab ALL
        ↓
useAssetLogs({ group: "all" })
        ↓
GET /assetLogs
        ↓
Jika pindah tab, lazy fetch group terkait
        ↓
Search lokal berdasarkan action/description/created_at
```

---

## 17. Error Handling dan Toast

Project menggunakan `sonner` untuk toast.

### 17.1 Toast Global dari Axios

File:

```text
src/api/client.ts
```

Handler:

- Rate limit:

```text
Terlalu banyak request.
Coba lagi dalam {retryAfter} detik.
```

- Unauthorized:

```text
Session expired.
Silakan login kembali.
```

- Server error:

```text
Terjadi kesalahan pada server.
```

### 17.2 Toast di Page

Contoh toast success:

```text
Lokasi berhasil ditambahkan
Lokasi berhasil diperbarui
Lokasi berhasil dihapus
```

Contoh toast error delete:

```text
Gagal menghapus data ini masih digunakan oleh tabel lain!
```

---

## 18. Role Access Matrix

| Fitur | ADMIN | KARYAWAN | Catatan |
|---|---:|---:|---|
| Login | ✅ | ✅ | Bergantung credential backend |
| Dashboard | ✅ | ✅ | Diizinkan untuk KARYAWAN |
| Borrow Assets | ✅ | ✅ | Karyawan melihat pinjaman sendiri |
| Locations | ✅ | ❌ | Admin only |
| Asset Categories | ✅ | ❌ | Admin only |
| Asset Types | ✅ | ❌ | Admin only |
| User/Karyawan | ✅ | ❌ | Admin only |
| Assets | ✅ | ❌ | Admin only |
| Asset Stock | ✅ | ❌ | Admin only |
| Rental | ✅ | ❌ | Admin only |
| Use Assets | ✅ | ❌ | Admin only |
| Maintenance Assets | ✅ | ❌ | Admin only |
| Asset Logs | ✅ | ❌ | Admin only |
| Divisi | ⚠️ | ❌ | Deprecated/legacy |

---

## 19. Catatan Modul Deprecated

Dokumentasi bawaan repository menyatakan bahwa modul:

```text
src/features/Divisi
src/api/divisi
```

adalah **deprecated** dan tidak lagi digunakan.

Namun di routing masih terdapat:

```text
/divisi
```

dan di API masih terdapat endpoint:

```text
/divisi
```

Rekomendasi:

- Jika benar-benar tidak dipakai, hapus route `/divisi`.
- Hapus menu atau import terkait.
- Hapus folder API dan feature terkait jika backend juga tidak memakai.
- Jika masih dipakai, update dokumentasi agar status deprecated tidak membingungkan.

---

## 20. Potensi Issue dan Rekomendasi Perbaikan

Bagian ini berisi catatan teknis dari pembacaan kode. Tidak semuanya pasti bug runtime, tetapi layak dicek saat maintenance.

### 20.1 Redirect 401 di Axios

Di `src/api/client.ts`, ketika status `401`, toast mengatakan user harus login kembali, tetapi redirect diarahkan ke:

```ts
window.location.href = "/dashboard";
```

Rekomendasi:

```ts
window.location.href = "/login";
```

Agar konsisten dengan pesan:

```text
Session expired. Silakan login kembali.
```

### 20.2 Typo atau Inkonsistensi Status Rental

Di type rental:

```ts
export type RentalStatus = "AKTIF" | "SELESAI" | "DIBATALKAN";
```

Namun di page rental terlihat filter history menggunakan:

```ts
r.status === "BATALKAN"
```

Rekomendasi:

- Gunakan satu istilah saja.
- Jika backend memakai `DIBATALKAN`, maka frontend juga harus memakai `DIBATALKAN`.

### 20.3 Inkonsistensi `payment_status` vs `status_payment`

Type rental memakai:

```ts
payment_status
```

Namun filter active rental terlihat mengecek:

```ts
r.status_payment !== "LUNAS"
```

Rekomendasi:

- Ganti menjadi `r.payment_status`.
- Pastikan nama field sama dengan response backend.

### 20.4 Bug Potensial `deleteAllNonActive`

Di hook rental terdapat logic:

```ts
setData((prev) => prev.filter((x) => {x.status === "AKTIF"}));
```

Karena callback menggunakan `{}` tanpa `return`, hasil filter akan selalu `undefined` sehingga semua item bisa terhapus dari state lokal.

Rekomendasi:

```ts
setData((prev) => prev.filter((x) => x.status === "AKTIF"));
```

### 20.5 Nama Fungsi Typo

Di hook rental:

```ts
deletAllnonActive
```

Rekomendasi:

```ts
deleteAllNonActive
```

Agar konsisten dan mudah dicari.

### 20.6 Nama Class `dataService`

Banyak modul memakai nama class generic:

```ts
dataService
```

Ini bekerja, tetapi kurang deskriptif.

Rekomendasi:

```ts
AssetService
AssetStockService
UserService
LocationService
RentalCustomerService
```

### 20.7 Type `data` Lowercase

Banyak interface bernama:

```ts
data
```

Rekomendasi:

```ts
Asset
AssetStock
User
Rental
RentalCustomer
MaintenanceAsset
```

Agar lebih sesuai konvensi TypeScript.

### 20.8 Password Muncul di Type User

Type user masih memuat:

```ts
password: string;
```

Rekomendasi:

- Jangan render password di table.
- Jangan simpan password di localStorage.
- Pastikan backend tidak mengirim password hash ke frontend.
- Gunakan type terpisah:
  - `User`
  - `CreateUserPayload`
  - `UpdateUserPayload`

### 20.9 Error Handling Service

Beberapa hook hanya melakukan:

```ts
console.error(...)
```

Rekomendasi:

- Tambahkan state `error`.
- Tampilkan error state di UI.
- Konsisten menggunakan toast untuk kegagalan create/update/delete.

### 20.10 Pagination Server-Side untuk Logs

`assetLogsService` sudah punya parameter:

```ts
take
skip
```

Namun UI dapat dikembangkan lagi agar pagination log tidak mengambil terlalu banyak data.

---

## 21. Checklist Pengembangan

### 21.1 Saat Menambah Modul CRUD Baru

Ikuti pola berikut:

```text
src/api/<module>/
├─ service.ts
├─ hooks.ts
└─ types.ts

src/features/<module>/
├─ pages/Page.tsx
├─ pages/Table.tsx
├─ pages/Modal.tsx
└─ pages/Types.ts
```

Checklist:

- [ ] Tambahkan endpoint di `src/api/endpoints.ts`.
- [ ] Buat type API.
- [ ] Buat service.
- [ ] Buat hook.
- [ ] Buat page.
- [ ] Buat table.
- [ ] Buat modal.
- [ ] Tambahkan route di `src/app/router.tsx`.
- [ ] Tambahkan menu di `src/components/Sidebar.tsx` jika perlu.
- [ ] Tambahkan role access.
- [ ] Tambahkan toast success/error.
- [ ] Test create/update/delete.
- [ ] Test error 401/429.
- [ ] Test responsive layout.

### 21.2 Saat Menambah Route Baru

- [ ] Import komponen di `router.tsx`.
- [ ] Tambahkan path ke children dashboard jika protected.
- [ ] Tambahkan menu di Sidebar.
- [ ] Pastikan role sudah sesuai.
- [ ] Pastikan route fallback tetap berjalan.

### 21.3 Saat Mengubah Endpoint Backend

- [ ] Update `src/api/endpoints.ts`.
- [ ] Cek service terkait.
- [ ] Cek type response.
- [ ] Cek field yang dipakai UI table/modal.
- [ ] Cek filter search.
- [ ] Cek toast error.

---

## 22. Panduan Deployment

### 22.1 Build Lokal

```bash
npm run build
```

Output build biasanya berada di:

```text
dist/
```

### 22.2 Preview Build

```bash
npm run preview
```

### 22.3 Deployment ke Platform Node/Vite Preview

Jika platform menyediakan `$PORT`, gunakan:

```bash
npm run start
```

Pastikan environment:

```env
VITE_URL_API="https://backend-production-url"
```

### 22.4 Deployment Static

Untuk static hosting seperti Netlify/Vercel/static server:

```bash
npm run build
```

Lalu publish folder:

```text
dist/
```

Catatan:

- Karena menggunakan `createBrowserRouter`, pastikan hosting mengarahkan semua route ke `index.html`.
- Untuk Netlify, biasanya perlu `_redirects`:

```text
/* /index.html 200
```

- Untuk Vercel, biasanya perlu konfigurasi rewrite jika route direct refresh menghasilkan 404.

---

## 23. FAQ Developer

### Q: Kenapa API selalu memakai `data.data`?

Backend response tampaknya berbentuk:

```ts
{
  success: boolean;
  data: T;
}
```

Karena Axios mengembalikan object response dalam property `data`, maka aksesnya menjadi:

```ts
const { data } = await privateClient.get<ApiResponse<T>>(url);
return data.data;
```

### Q: Kenapa ada `publicClient` dan `privateClient`?

Agar request publik dan private dipisah.

- `publicClient`: tidak inject token.
- `privateClient`: inject Bearer token otomatis.

### Q: Token disimpan di mana?

Token disimpan di:

```text
localStorage["token"]
```

User disimpan di:

```text
localStorage["user"]
```

### Q: Apa role karyawan bisa akses data master?

Tidak. `ProtectedRoute` hanya mengizinkan `KARYAWAN` membuka:

```text
/dashboard
/borrow-assets
```

### Q: Kenapa data table langsung berubah setelah create/update/delete?

Karena hook mengubah state lokal setelah API sukses. Contoh setelah delete:

```ts
setData((prev) => prev.filter((item) => item.id !== id));
```

### Q: Kenapa modul Divisi masih ada?

Dokumentasi repo menyebut Divisi deprecated, tetapi route dan API masih ada. Ini kemungkinan sisa modul lama.

---

## 24. Glosarium

| Istilah | Arti |
|---|---|
| Asset | Data master aset/barang |
| Asset Stock | Data jumlah aset berdasarkan aset dan lokasi |
| Asset Type | Tipe aset |
| Asset Category | Kategori aset |
| Borrow Asset | Peminjaman aset oleh user/karyawan |
| Use Asset | Pemakaian aset internal |
| Maintenance Asset | Aset yang masuk perbaikan/maintenance |
| Rental Asset | Penyewaan aset ke customer |
| Rental Customer | Customer penyewa |
| Asset Logs | Riwayat aktivitas aset |
| `publicClient` | Axios client tanpa token |
| `privateClient` | Axios client dengan Bearer token |
| `ProtectedRoute` | Gatekeeper route berdasarkan token dan role |
| `Dashboardlayout1` | Layout utama setelah login |
| `useData` | Nama hook umum untuk fetch/mutasi data di banyak modul |
| `dataService` | Nama service umum untuk request API di banyak modul |

---

## Lampiran A — Ringkasan File Penting

| File | Fungsi |
|---|---|
| `src/main.tsx` | Entry point React, render RouterProvider |
| `src/app/router.tsx` | Daftar routing aplikasi |
| `src/app/protectedRoute.tsx` | Proteksi route berdasarkan token dan role |
| `src/api/client.ts` | Konfigurasi Axios dan global error handler |
| `src/api/endpoints.ts` | Daftar endpoint backend |
| `src/api/auth/hooks.ts` | Logic login/logout/localStorage |
| `src/components/Sidebar.tsx` | Navigasi role-based |
| `src/components/Navbar.tsx` | Header, profil, logout |
| `src/layouts/Dashboardlayout1.tsx` | Layout utama dashboard |
| `src/features/login/pages/login.tsx` | Halaman login |
| `src/features/dashboard/pages/DashboardPage.tsx` | Halaman dashboard |
| `src/features/Assets/pages/Page.tsx` | Halaman master aset |
| `src/features/AssetsStock/pages/Page.tsx` | Halaman stok aset |
| `src/features/borrowAssets/Page.tsx` | Halaman peminjaman aset |
| `src/features/useAssets/Page.tsx` | Halaman pemakaian aset |
| `src/features/maintenanceAssets/Page.tsx` | Halaman maintenance aset |
| `src/features/rental/asset_rental/page.tsx` | Halaman rental |
| `src/features/assetLogs/pages/Page.tsx` | Halaman logs |

---

## Lampiran B — Template Modul CRUD Baru

### `src/api/example/types.ts`

```ts
export interface Example {
  id_example: number;
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CreateExampleDTO {
  name: string;
  description: string;
}

export interface UpdateExampleDTO {
  name?: string;
  description?: string;
}
```

### `src/api/example/service.ts`

```ts
import { privateClient } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { Example, CreateExampleDTO, UpdateExampleDTO, ApiResponse } from "./types";

export class ExampleService {
  static async getAll(): Promise<Example[]> {
    const { data } = await privateClient.get<ApiResponse<Example[]>>(ENDPOINTS.EXAMPLE);
    return data.data;
  }

  static async create(payload: CreateExampleDTO): Promise<Example> {
    const { data } = await privateClient.post<ApiResponse<Example>>(ENDPOINTS.EXAMPLE, payload);
    return data.data;
  }

  static async update(id: number, payload: UpdateExampleDTO): Promise<Example> {
    const { data } = await privateClient.put<ApiResponse<Example>>(`${ENDPOINTS.EXAMPLE}/${id}`, payload);
    return data.data;
  }

  static async delete(id: number): Promise<void> {
    await privateClient.delete(`${ENDPOINTS.EXAMPLE}/${id}`);
  }
}
```

### `src/api/example/hooks.ts`

```ts
import { useEffect, useState } from "react";
import { ExampleService } from "./service";
import type { Example, CreateExampleDTO, UpdateExampleDTO } from "./types";

export const useExamples = () => {
  const [examples, setExamples] = useState<Example[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExamples = async () => {
    try {
      setLoading(true);
      const data = await ExampleService.getAll();
      setExamples(data);
    } finally {
      setLoading(false);
    }
  };

  const createExample = async (payload: CreateExampleDTO) => {
    const created = await ExampleService.create(payload);
    setExamples((prev) => [...prev, created]);
  };

  const updateExample = async (id: number, payload: UpdateExampleDTO) => {
    const updated = await ExampleService.update(id, payload);
    setExamples((prev) => prev.map((x) => (x.id_example === id ? updated : x)));
  };

  const deleteExample = async (id: number) => {
    await ExampleService.delete(id);
    setExamples((prev) => prev.filter((x) => x.id_example !== id));
  };

  useEffect(() => {
    fetchExamples();
  }, []);

  return {
    examples,
    loading,
    fetchExamples,
    createExample,
    updateExample,
    deleteExample,
  };
};
```

---

## Lampiran C — Saran Standardisasi Naming

Untuk jangka panjang, disarankan mengganti pola nama generik:

| Saat ini | Saran |
|---|---|
| `data` | `Asset`, `User`, `Rental`, dll |
| `CreateData` | `CreateAssetDTO`, `CreateUserDTO`, dll |
| `UpdateData` | `UpdateAssetDTO`, `UpdateUserDTO`, dll |
| `dataService` | `AssetService`, `UserService`, dll |
| `Data` | `assets`, `users`, `locations`, dll |

Manfaat:

- Lebih mudah dibaca.
- Lebih mudah autocomplete.
- Lebih aman ketika import banyak module.
- Mengurangi kebingungan antar file.

---

## Lampiran D — Quick Start untuk Developer Baru

```bash
# 1. Clone
git clone https://github.com/mendingNgodeng/inventory_for_edukarya.git

# 2. Masuk folder
cd inventory_for_edukarya

# 3. Checkout branch
git checkout staging

# 4. Install dependency
npm install

# 5. Setup env
cp .env.example .env

# 6. Edit .env
# VITE_URL_API="http://localhost:3000"

# 7. Jalankan
npm run dev
```

Setelah app berjalan:

1. Buka `/login`.
2. Login dengan credential dari backend.
3. Masuk ke dashboard.
4. Cek menu sesuai role.

---

## Lampiran E — Urutan Belajar Kode yang Disarankan

Untuk developer baru, baca file dalam urutan berikut:

1. `package.json`
2. `.env.example`
3. `src/main.tsx`
4. `src/app/router.tsx`
5. `src/app/protectedRoute.tsx`
6. `src/api/client.ts`
7. `src/api/endpoints.ts`
8. `src/api/auth/hooks.ts`
9. `src/layouts/Dashboardlayout1.tsx`
10. `src/components/Sidebar.tsx`
11. `src/components/Navbar.tsx`
12. `src/features/dashboard/pages/DashboardPage.tsx`
13. Salah satu modul CRUD sederhana:
    - `src/features/locations/pages/locationPage.tsx`
    - `src/api/location/hooks.ts`
    - `src/api/location/service.ts`
    - `src/api/location/types.ts`
14. Modul kompleks:
    - `borrowAssets`
    - `maintenanceAssets`
    - `rental`
    - `assetLogs`

---

## Penutup

Area yang paling penting untuk dirapikan ke depan:

1. Standardisasi naming type/service/hook.
2. Konsistensi status rental dan field pembayaran.
3. Redirect 401 ke `/login`.
4. Penghapusan atau pembaruan modul Divisi.
5. Error state yang lebih konsisten di semua page.
6. Pagination server-side untuk data besar seperti logs.
7. Kurang Multiple input untuk asset dan asset_stock
