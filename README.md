# Baraka Homes

Baraka Homes is a mobile rental-management app for tenants, agents, and owners in Nairobi. It brings homes, rent payments, maintenance, documents, and account security into one calm, easy-to-use experience.

## App screens

### Welcome

<img src="assets/readme/onboarding.png" alt="Baraka Homes welcome screen" width="260" />

### Tenant portal

| Profile and account security | Maintenance requests |
| --- | --- |
| <img src="assets/readme/tenant-profile.png" alt="Tenant profile screen" width="260" /> | <img src="assets/readme/tenant-maintenance.png" alt="Tenant maintenance screen" width="260" /> |

### Agent portal

| Managed homes | Maintenance work queue | Agent profile |
| --- | --- | --- |
| <img src="assets/readme/agent-workspace.png" alt="Agent managed homes screen" width="220" /> | <img src="assets/readme/agent-maintenance.png" alt="Agent maintenance screen" width="220" /> | <img src="assets/readme/agent-profile.png" alt="Agent profile screen" width="220" /> |

## What is included

- Tenant, Agent, and Owner roles
- Google sign-in for tenants and email/password sign-in for seeded staff accounts
- Managed homes grouped into Apartments, Houses, Shops, and BNB
- Property details with room photos, monthly pricing, and amenities
- Rent and utility payments with PayHero integration points
- Maintenance requests and tenant documents
- Profile photo upload, password updates, sign-in alerts, and referral links
- Statement download prepared for future PDF workflows

## Tech stack

- Expo and React Native
- Expo Router
- TypeScript and NativeWind
- Appwrite Authentication, Databases, and Storage
- Lucide React Native icons
- PayHero payment integration

## Get started

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

Create `.env` in the project root. Do not commit this file.

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
EXPO_PUBLIC_APPWRITE_USER_PROFILES_COLLECTION_ID=your-user-profiles-collection-id
EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID=your-properties-collection-id
EXPO_PUBLIC_APPWRITE_BUCKET_ID=your-storage-bucket-id
EXPO_PUBLIC_APPWRITE_PAYHERO_FUNCTION_ID=payhero-payments

# Server-only: required only when seeding accounts.
APPWRITE_API_KEY=your-appwrite-api-key
```

### 3. Start the app

```bash
npm run start
```

The project is configured to use port `8081`.

## Demo accounts

Create an Appwrite API key with `users.write`, add it as `APPWRITE_API_KEY` in `.env`, then run:

```bash
npm run seed:users
```

| Role | Email | Password |
| --- | --- | --- |
| Tenant | `tenant@barakahomes.test` | `Tenant@123` |
| Agent | `agent@barakahomes.test` | `Agent@123` |
| Owner | `owner@barakahomes.test` | `Owner@123` |

Google sign-in creates a Tenant account automatically. Change all demo passwords before any production use.

## Useful commands

```bash
npm run start       # Expo on port 8081
npm run android     # Android development build
npm run web         # Web preview on port 8081
npm run lint        # Lint the project
npm run seed:users  # Create or refresh demo users
```

## Project structure

```text
app/                 Expo Router screens
components/          Shared UI and role dashboards
lib/                 Appwrite, PayHero, data, and helpers
assets/images/       App, tenant, and onboarding images
scripts/             Local user-seeding script
```
