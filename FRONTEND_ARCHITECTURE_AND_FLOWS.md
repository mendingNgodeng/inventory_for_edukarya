# Edukarya Inventory Frontend - Architecture & Flow Documentation

This document describes the high-level architecture, module structure, and generic data/request flows of the `inventory_for_edukarya` frontend project.

> **Note on Deprecation:** The **Divisi** module (`src/features/Divisi`, `src/api/divisi`) is deprecated and no longer used in the application.

---

## 1. High-Level Architecture Overview

The application is built with **React and Vite**, utilizing **TypeScript** extensively for strict type enforcement. It adopts a modular, feature-based architecture to separate responsibilities clearly.

- **Routing Protocol:** Handled centrally by `react-router-dom` (`src/app/router.tsx`).
- **State Management:** The app deliberately eschews complex global state managers (like Redux). Instead, it relies on local React state (`useState`, `useEffect`) grouped cleanly into custom hooks (e.g., `useData`) bound to specific features. Authenticative states are persisted on `localStorage` combined with Axios interceptors.
- **HTTP/Network Layer:** Managed using `axios` instances (`publicClient`, `privateClient`) customized with interceptors for error-handling and silent token injection.
- **Micro-Interfaces / Notifications:** Modals, dialogs, and user notifications (`sonner` toasts) are managed seamlessly without blocking UI threads.
- **CSS Framework:** **Tailwind CSS**, integrated directly into standard JSX elements.

---

## 2. Granular Directory Structure

The codebase adheres closely to domain-driven design structures under `src/`:

```text
src/
 ├─ api/         # Defines network layer boundaries.
 │   ├─ client.ts       # Setup for Public/Private Axios clients globally catching 401 & 429 statuses.
 │   ├─ endpoints.ts    # Centralized dictionary preventing endpoint typographical errors.
 │   └─ <features>/     # Endpoint-specific directories (e.g., assets, locations). These house `service.ts`, `hooks.ts`, and `types.ts`.
 ├─ app/         # Bootstrap mechanics.
 │   ├─ router.tsx           # URL mapping dictionary.
 │   └─ protectedRoute.tsx   # Access control gateway reading LocalStorage auth metrics.
 ├─ components/  
 │   ├─ Navbar.tsx / Sidebar.tsx   # Persistent Layout elements.
 │   └─ ui/                        # Atomic reusable UI components (Buttons, Selects, Tables, Toasts).
 ├─ features/    # Discrete pages/screens isolated by business logic. (e.g., login, Assets, locations).
 └─ layouts/     # Overall skeleton wrappers like Dashboardlayout1.tsx housing <Outlet/>.
```

---

## 3. Elaborate System Flows

### 3.1. Authentication and Zero-Trust Authorization Flow
The application assumes unauthenticated status by default unless implicitly overridden.

1. **Gatekeeping Request:** Visitors accessing the root url `/` hit the `protectedRoute.tsx` gateway. If `localStorage.getItem("token")` evaluates false, `Navigate to="/login"` fires immediately.
2. **Credential Processing:** At `/login`, form submission is bridged via `src/api/auth/service.ts`, executing `authService.login()`.
3. **Storage:** The backend provisions a JWT token. The UI maps the exact JSON Object to `localStorage.setItem('user', ...)` and `localStorage.setItem('token', ...)`.
4. **Role Filtering:** `protectedRoute.tsx` unpacks the user object. If `user.role === "KARYAWAN"`, it prevents them from accessing critical data paths (falling back to `/borrow-assets`), while omitting role-checks for admin operators natively.
5. **Token Expiry Management:** Assuming an ongoing session, if an operator interacts with a view but the token has died server-side, the next API call triggers a 401 Unauthorized block. `client.ts` automatically catches this globally, resets `localStorage`, ejects a `sonner` expiration toast, and hard-redirects to login.

### 3.2. Concrete Data Fetching Flow (Hook Pattern Strategy)
The architecture strongly favors isolating data logic via Hooks. 

1. **Page Mount:** User navigates to `/asset`. The `Page` shell mounts (`src/features/Assets/pages/Page.tsx`).
2. **Hook Execution:** The layout invokes `const { Data, createData, updateData, deleteData } = useData()`.
3. **Triggered Action:** Under the hood (`api/assets/hooks.ts`), a `useEffect` triggers `fetchData()` which communicates with `dataService.getAll()` in `service.ts`.
4. **Secure Transport:** `dataService.getAll()` passes the `/asset` endpoint request into `privateClient` (`client.ts`). The Axios request interceptor captures it just before transmission, silently injecting: `Authorization: Bearer <token>`.
5. **Reconciliation:** The server's array of assets returns securely. The promise unravels in `hooks.ts`, executing `setData(data)`.
6. **Reactive DOM Shift:** React observes the localized array `Data` has changed, causing the `<Table>` to re-render vividly with the new list of network assets automatically.

### 3.3. Write/Mutation Mechanics (CRU/Delete Logic)
1. User clicks **"Tambah Aset"** (Add Asset). 
2. `setIsModalOpen(true)` pushes the custom `<Modal>` component onto the stack overlay.
3. User fills the generated form and submits. `Page.tsx` receives the package via `handleSubmit`.
4. The hook method `createData` dispatches a payload to the backend. Alternatively, clicking Edit sets `editingData` and routes traffic through `updateData(id)`.
5. A successful resolution ejects a Toast Notification indicating completion (`toast.success`) and artificially injects the new row into the local state table, ensuring a seamless rapid UI response without needing to refresh.
