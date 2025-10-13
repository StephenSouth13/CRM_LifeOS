# Life OS - Enterprise Life Management System

A comprehensive enterprise management system built with Next.js 15, TypeScript, and modern web technologies.

## Features

- **Role-Based Access Control (RBAC)** - 4 distinct roles with specific permissions
- **Attendance Tracking** - Real-time check-in/out with working hours calculation
- **Task Management** - Kanban board and list views with priority management
- **Calendar & Scheduling** - Event management with multiple view modes
- **Note-Taking** - Personal, team, and organization-wide notes
- **Room Booking** - Resource management with availability tracking
- **Approval Workflows** - Leave requests and approval system
- **Media Player** - Persistent Spotify/YouTube/Pomodoro integration
- **Multi-language** - Vietnamese and English support
- **Dark/Light Mode** - Beautiful theme system with vibrant colors
- **Mobile Responsive** - Optimized for all screen sizes

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Internationalization**: i18next
- **Icons**: Lucide React

## Demo Accounts

The system includes 4 demo accounts representing different roles:

### Owner Account
- **Username**: `longvsm`
- **Password**: `123456`
- **Email**: `longvsm@lifeos.com`
- **Permissions**: Full system access, organization management, billing, highest configuration

### Admin Account
- **Username**: `admin`
- **Password**: `123456`
- **Email**: `admin@lifeos.com`
- **Permissions**: User management, module settings, reports, payroll configuration

### Leader Account
- **Username**: `leader`
- **Password**: `123456`
- **Email**: `leader@lifeos.com`
- **Permissions**: Team management, approve attendance/leave, assign tasks, view team KPI

### Staff Account
- **Username**: `staff`
- **Password**: `123456`
- **Email**: `staff@lifeos.com`
- **Permissions**: Check-in/out, complete tasks, manage schedule, create notes, request leave

## Role Permissions Matrix

| Feature | Owner | Admin | Leader | Staff |
|---------|-------|-------|--------|-------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Attendance | ✅ | ✅ | ✅ | ✅ |
| Tasks | ✅ | ✅ | ✅ | ✅ |
| Calendar | ✅ | ✅ | ✅ | ✅ |
| Notes | ✅ | ✅ | ✅ | ✅ |
| Room Booking | ✅ | ✅ | ✅ | ✅ |
| Media Player | ✅ | ✅ | ✅ | ✅ |
| User Management | ✅ | ✅ | ❌ | ❌ |
| Reports | ✅ | ✅ | ❌ | ❌ |
| Team Management | ✅ | ✅ | ✅ | ❌ |
| Approvals | ✅ | ✅ | ✅ | ❌ |
| Organizations | ✅ | ❌ | ❌ | ❌ |
| Billing | ✅ | ❌ | ❌ | ❌ |
| System Settings | ✅ | ✅ | ❌ | ❌ |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd life-os
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Login with one of the demo accounts above

## Database Setup (For Real Data)

Currently, the application uses mock data stored in Zustand state. To connect to a real database:

### Option 1: Supabase (Recommended)

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Add environment variables to your project:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

3. Run the database migration scripts in \`/scripts\` folder:
   - \`01_create_tables.sql\` - Creates all necessary tables
   - \`02_create_rls_policies.sql\` - Sets up Row Level Security
   - \`03_seed_data.sql\` - Seeds initial data

4. Update the store and API calls to use Supabase client instead of mock data

### Option 2: Neon PostgreSQL

1. Create a Neon project at [neon.tech](https://neon.tech)

2. Add environment variable:
\`\`\`env
DATABASE_URL=your_neon_connection_string
\`\`\`

3. Use the same SQL scripts from \`/scripts\` folder

4. Update data fetching logic to use PostgreSQL queries

### Database Schema

The application requires the following tables:

- \`organizations\` - Company/organization data
- \`users\` - User accounts and profiles
- \`roles\` - Role definitions
- \`permissions\` - Permission definitions
- \`role_permissions\` - Role-permission mappings
- \`memberships\` - User-organization-role relationships
- \`workspaces\` - Workspace/team data
- \`tasks\` - Task management
- \`attendance_logs\` - Attendance records
- \`leave_requests\` - Leave request data
- \`notes\` - Note-taking data
- \`events\` - Calendar events
- \`rooms\` - Room/resource data
- \`bookings\` - Room booking records
- \`media_player_state\` - Persistent media player state
- \`audit_logs\` - System audit trail

See \`/scripts/01_create_tables.sql\` for complete schema definitions.

## Project Structure

\`\`\`
life-os/
├── app/                      # Next.js app directory
│   ├── auth/                # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── dashboard/           # Dashboard pages
│   │   ├── attendance/
│   │   ├── tasks/
│   │   ├── calendar/
│   │   ├── notes/
│   │   ├── rooms/
│   │   ├── media/
│   │   ├── admin/
│   │   └── settings/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard-nav.tsx
│   ├── floating-ai.tsx
│   ├── persistent-media-player.tsx
│   └── ...
├── lib/                     # Utility libraries
│   ├── store.ts            # Zustand store
│   ├── i18n.ts             # Internationalization
│   ├── types.ts            # TypeScript types
│   ├── permissions.ts      # RBAC logic
│   └── utils.ts            # Utility functions
├── hooks/                   # Custom React hooks
├── public/                  # Static assets
└── scripts/                 # Database scripts
\`\`\`

## Color Scheme

The application uses a vibrant, professional color palette:

- **Primary (Green)**: oklch(0.6 0.2 160) - Main brand color
- **Secondary (Blue)**: oklch(0.55 0.18 240) - Secondary actions
- **Accent (Yellow)**: oklch(0.75 0.18 90) - Highlights and emphasis
- **Background (Black/White)**: Pure black in dark mode, white in light mode
- **Foreground**: High contrast text colors

## Key Features Explained

### Persistent Media Player

The media player stays mounted at the root layout level, ensuring music and videos continue playing while navigating between sections. It supports:
- YouTube videos
- Spotify playlists
- Pomodoro timer
- Volume control
- Playback controls
- Expandable full-screen mode

### Role-Based Access Control

The RBAC system provides granular control over features:
- Permission checks at component level
- Route protection based on roles
- Dynamic navigation based on user permissions
- Audit logging for sensitive actions

### Mobile Optimization

- Off-canvas sidebar with smooth animations
- Touch-optimized controls (44px minimum)
- Responsive grid layouts
- Safe area support for notched devices
- Bottom action bar for quick access

## Development

### Adding New Features

1. Define types in \`lib/types.ts\`
2. Add translations in \`lib/i18n.ts\`
3. Create components in \`components/\`
4. Add routes in \`app/dashboard/\`
5. Update navigation in \`components/dashboard-nav.tsx\`
6. Add permissions in \`lib/permissions.ts\`

### Testing Different Roles

Simply logout and login with different demo accounts to test role-specific features.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- Self-hosted with Docker

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Built with ❤️ using Next.js and modern web technologies
