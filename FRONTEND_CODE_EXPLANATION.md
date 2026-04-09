# Edukarya Inventory Frontend - Comprehensive Code Explanation

This document provides deep technical explanations of the core mechanics, specific file behaviors, and underlying abstractions driving the frontend codebase.

---

## 1. Crucial Architectural Foundations

### Abstracted Network Client (`src/api/client.ts`)
This is the lifeblood of communication for the entire React app. It exports `publicClient` and `privateClient`.
- **Why it matters:** Instead of typing out `fetch()` and manually pasting the Auth Bearer token inside every single file, the app defines interceptors on `privateClient`. 
- **Under the hood:**
  ```typescript
  privateClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`; // Automatically stamps all outbound secure requests.
    return config;
  });
  ```
- **Global Error Handling:** It universally interrupts responses. If a backend spits out a `429` (Rate limit) or `401` (Unauthorized), the user instantly receives a `toast.error` popup smoothly, completely negating the need to write `catch(e)` logic regarding Tokens universally inside feature files.

---

## 2. Application Skeleton Patterns

### The Shell Structure (`src/layouts/Dashboardlayout1.tsx`)
This file is the root visual tree once authenticated. 
- It houses a massive wrapper `<div className="flex min-h-screen">`.
- It anchors the left layout element `<Sidebar />` natively. It observes window resize events to toggle responsively for mobile screens.
- It anchors the top ceiling component `<Navbar />`.
- At its core lies `<Outlet />` (imported from React Router DOM). This acts as an empty canvas frame. When the user navigates routes (like `/locations` or `/divisi`), React swaps the feature's entire TSX content precisely into this Outlet zone without destroying the Navbar or Sidebar.

---

## 3. The Hook & Service Abstraction Rule (Feature Lifecycle)

To prevent files compiling into thousands of lines of code, the feature pages isolate their logic brilliantly via a combination of `Page.tsx`, `hooks.ts`, and `service.ts`.

Here is the exact lifecycle of how a feature (like **Assets**) operates logically:

#### 1: External Abstraction (`src/api/assets/service.ts`)
This file is fully sanitized of React. It solely handles static web requests tied to Types.
```typescript
static async getAll(): Promise<data[]> {
  const { data } = await privateClient.get<ApiResponse<data[]>>(ENDPOINTS.ASSETS);
  return data.data; 
}
```

#### 2: Internal Hook State (`src/api/assets/hooks.ts`)
This acts as the bridge connecting the dumb Service to the dynamic React DOM.
It manages raw state variables (`Data`, `loading`).
When invoked, it inherently queries the database upon mount (`useEffect(() => fetchData(), [])`) and provides functions to mutate data:
```typescript
const deleteData = async (id: number) => {
  await dataService.delete(id); // hits backend
  setData((prev) => prev.filter((loc) => loc.id_assets !== id)); // surgically slices the local table variable without reloading 
};
```

#### 3: Render Mechanism (`src/features/Assets/pages/Page.tsx`)
The UI shell. It ignores network URLs completely. It just imports hooks and builds the view.
- It holds minor UI state controls (`isModalOpen`, `searchTerm`, `editingData`).
- Calculates filtering locally for hyper-fast search interactions: `const filtered = Data.filter(...)`.
- Passes permutations of data downward into strictly stylistic components: `<Table data={filtered} />` and `<Modal onSubmit={handleSubmit} />`.

---

## 4. Unpacking Core Output UI Components

The `src/components/ui/` folder constructs the aesthetic identity.

- **`Modal.tsx` & `alert.tsx`:** Floating window overlays using heavy Tailwind index controls (`z-50`, absolute positioning, blurred black backgrounds). Used mostly for confirmation dials or complex Create/Update entry forms.
- **`button.tsx`:** A highly modularized standard button structure capable of taking dynamic `variant` props (like `outline_blue`, `destructive`), returning appropriately colored classes systematically.
- **`tablefilter-bar.tsx`:** An independent shell acting like a control panel above data grids. It receives props instructing it what search query to maintain or which category drop downs are available to interact with.
- **`Toaster` (from `sonner`):** An external library structurally wired into the root DOM (usually the `App` or `DashboardLayout`), designed to intercept simple message strings globally and float small green checkmarks or red warnings in the corner of the user's screen temporarily. 

> **Friendly Reminder**: The code existing under `src/features/Divisi` and its related dependencies `src/api/divisi` are dormant and safely ignored configurations inside this project space.
