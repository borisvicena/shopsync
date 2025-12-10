# App Directory Structure

This document explains the logical organization of the `/src/app` directory for easy navigation.

## **Folder Structure Overview**

```
src/app/
├── (dashboard)/                # -- Dashboard Group --
│   ├── page.tsx                # Dashboard/Home page
│   └── lists/                  # Shopping lists
│       └── [id]/               # Individual list details
│           └── page.tsx        # List detail page
│
├── (auth)/                     # -- Authentication Group --
│   ├── login/                  # Login page
│   │   └── page.tsx
│   └── signup/                 # Sign up page
│       └── page.tsx
│
├── (user)/                     # -- User Group --
│   └── profile/                # User profile
│       └── page.tsx            # Profile settings page
├── layout.tsx                  # Root layout
├── not-found.tsx               # 404 page
└── globals.css                 # Global styles
```

### **URL Routes**

| URL              | File Location                     | Description      |
| ---------------- | --------------------------------- | ---------------- |
| `/`              | `(dashboard)/page.tsx`            | Home dashboard   |
| `/lists/[id]`    | `(dashboard)/lists/[id]/page.tsx` | List details     |
| `/login`         | `(auth)/login/page.tsx`           | Login page       |
| `/signup`        | `(auth)/signup/page.tsx`          | Sign up page     |
| `/success`       | `(auth)/success/page.tsx`         | Signup success   |
| `/profile`       | `(user)/profile/page.tsx`         | User profile     |
| `/settings`      | `(user)/settings/page.tsx`        | App settings     |
| `/privacy`       | `(legal)/privacy/page.tsx`        | Privacy policy   |
| `/terms`         | `(legal)/terms/page.tsx`          | Terms of service |
| `/auth/callback` | `(api)/auth/callback/route.ts`    | OAuth callback   |

### **Route Groups**

-   **`(dashboard)`** - Main app functionality, shopping lists
-   **`(auth)`** - Authentication pages and flows
-   **`(user)`** - User account management pages
