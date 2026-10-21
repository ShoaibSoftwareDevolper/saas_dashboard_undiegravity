# Onixpas SaaS Dashboard

A production ready SaaS project management dashboard template by **Undiegravity**. The frontend is complete and fully wired to a typed API layer, so connecting your own backend is a matter of setting one environment variable.

## Features

* Authentication with session restore, remember me and automatic sign out on expired tokens
* Dashboard with project stats, weekly analytics, project list, team list, progress and time tracker
* Global search with debounce and keyboard shortcut
* Settings with profile, notification preferences and password change
* Quick add forms for projects and team members
* Loading, empty and error states on every data card
* Fully responsive layout from 320px to desktop
* Design tokens for colors, spacing, typography, radius, shadows and motion
* Built in mock API for instant demos, removed from the request path when a real backend is enabled

## Tech Stack

| Package | Version |
| --- | --- |
| React | 19.3.1 |
| React DOM | 19.3.1 |
| React Router | 8.5.0 |
| TypeScript | 6.0.3 |
| Vite | 8.3.4 |
| @vitejs/plugin-react | 6.1.2 |
| Lucide React | 1.60.0 |
| ESLint | 10.13.0 |
| typescript-eslint | 8.72.0 |
| Node.js | 22 or newer |
| npm | 11 |

Styling is plain CSS Modules driven by design tokens. There is no runtime CSS library.

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Demo credentials in mock mode:

| Field | Value |
| --- | --- |
| Email | demo@onixpas.com |
| Password | onixpas123 |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type check and create a production build |
| `npm run typecheck` | Run the TypeScript compiler only |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve the production build locally |

## Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_USE_MOCK_API` | `true` | Set to `false` to call a real backend |
| `VITE_API_BASE_URL` | empty | Base URL of your API, for example `https://api.example.com` |
| `VITE_MOCK_LATENCY` | `600` | Simulated latency in milliseconds for mock mode |

## Connecting Your Backend

1. Set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL` to your API origin.
2. Implement the endpoints below. All paths are defined in `src/config/endpoints.ts`.
3. Authenticated requests send `Authorization: Bearer <token>`.
4. Errors must return a non 2xx status with a JSON body of `{ "message": "Readable error" }`.
5. A `401` response on an authenticated request signs the user out automatically.
6. A `204` response is accepted for empty results.

### Endpoints

| Method | Path | Body | Response |
| --- | --- | --- | --- |
| POST | `/auth/login` | `LoginPayload` | `AuthResponse` |
| POST | `/auth/logout` | none | empty |
| GET | `/auth/me` | none | `User` |
| GET | `/dashboard/stats` | none | `StatMetric[]` |
| GET | `/dashboard/analytics` | none | `AnalyticsPoint[]` |
| GET | `/dashboard/progress` | none | `ProgressSummary` |
| GET | `/projects` | none | `Project[]` |
| POST | `/projects` | `CreateProjectPayload` | `Project` |
| GET | `/team` | none | `TeamMember[]` |
| POST | `/team` | `CreateMemberPayload` | `TeamMember` |
| GET | `/time-tracker` | none | `TimeTrackerSession` |
| GET | `/notifications/summary` | none | `NotificationSummary` |
| GET | `/search?q=term` | none | `SearchResult[]` |
| GET | `/settings/notifications` | none | `NotificationPreferences` |
| PUT | `/settings/notifications` | `NotificationPreferences` | `NotificationPreferences` |
| PUT | `/settings/profile` | `UpdateProfilePayload` | `User` |
| PUT | `/settings/password` | `ChangePasswordPayload` | empty |

All request and response types live in `src/types/index.ts`.

## Project Structure

```
src
  components/ui      Reusable primitives: Button, Card, TextField, Toggle, Avatar
  config             App config, endpoints, routes, navigation and all UI copy
  context            Auth provider and context
  features           Dashboard and settings feature components
  hooks              useAuth, useRequest, useFormSubmit
  layouts            Dashboard shell with sidebar and topbar
  pages              Route level pages
  routes             Protected and guest route guards
  services           HTTP client, typed API services and mock adapter
  styles             Design tokens and global styles
  types              Shared TypeScript contracts
  utils              Formatting and validation helpers
```

## Customization

* **Brand and copy:** edit `src/config/app.config.ts` and `src/config/content.ts`.
* **Colors, spacing and typography:** edit `src/styles/tokens.css`. Components never use raw values.
* **Navigation:** edit `src/config/navigation.ts` and `src/config/routes.ts`.
* **Logo:** replace the file in `public` and update `logo` in `app.config.ts`.
* **New module page:** add the page component and register its route in `src/App.tsx`.

## Deployment

```bash
npm run build
```

Serve the `dist` folder from any static host and route all paths to `index.html` so client side routing works.

## License

Provided by Undiegravity. See your purchase license for usage terms.
