# Service Plus Frontend - Comprehensive Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Core Features](#core-features)
6. [Component Documentation](#component-documentation)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Routing](#routing)
10. [Authentication & Authorization](#authentication--authorization)
11. [Theming & Styling](#theming--styling)
12. [Development Guidelines](#development-guidelines)
13. [Testing](#testing)
14. [Build & Deployment](#build--deployment)
15. [Troubleshooting](#troubleshooting)

## Project Overview

**Service Plus Frontend** is a comprehensive web application designed for service management and real-time monitoring of distributed systems. The application provides a modern, responsive interface for monitoring alarms, managing sites, tracking system performance, and handling user permissions.

### Key Features

- **Real-time Dashboard**: Live monitoring of system status, alarms, and performance metrics
- **Site Management**: Comprehensive site configuration and monitoring capabilities
- **Alarm Management**: Advanced alarm tracking, processing, and recovery systems
- **User Management**: Role-based access control with granular permissions
- **Interactive Maps**: Geographic visualization of sites and alerts
- **Analytics & Reporting**: Detailed charts and statistics for system performance
- **Multi-theme Support**: Light and dark theme with persistent preferences

## Technology Stack

### Core Technologies

- **React 18.2.0**: Modern React with hooks and functional components
- **TypeScript 5.2.2**: Type-safe JavaScript development
- **Vite 4.4.10**: Fast build tool and development server
- **Ant Design 5.9.4**: Comprehensive UI component library
- **Redux Toolkit 1.9.6**: Modern Redux with simplified state management
- **React Router DOM 6.16.0**: Client-side routing

### Key Libraries

- **@react-google-maps/api 2.19.2**: Google Maps integration for geographic visualization
- **Recharts 2.8.0**: Chart library for data visualization
- **Day.js 1.11.10**: Lightweight date manipulation
- **js-cookie 3.0.5**: Cookie management for theme persistence
- **Lodash.debounce**: Performance optimization for search and filtering
- **query-string 8.1.0**: URL query parameter handling

### Development Tools

- **ESLint**: Code linting with Airbnb configuration
- **Prettier**: Code formatting
- **Stylelint**: CSS/SCSS linting
- **Vitest**: Unit testing framework
- **SWC**: Fast JavaScript/TypeScript compiler

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── action-list/     # Action list components
│   │   ├── alarm-*/         # Alarm-related components
│   │   ├── dashboard-*/     # Dashboard layout components
│   │   ├── navigation/      # Navigation components
│   │   ├── pop-over/        # Modal and popup components
│   │   ├── site-*/          # Site management components
│   │   ├── theme-switcher/  # Theme switching component
│   │   └── user-*/          # User management components
│   ├── pages/               # Page components
│   │   ├── alarm-*/         # Alarm management pages
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Main dashboard page
│   │   ├── site-*/          # Site management pages
│   │   └── users/           # User management pages
│   ├── widgets/             # Dashboard widgets
│   │   ├── alerts-*/        # Alert visualization widgets
│   │   ├── site-map/        # Site map widget
│   │   └── statistic-card/  # Statistics display widget
│   ├── charts/              # Chart components
│   │   ├── area-chart/      # Area chart component
│   │   ├── base-*/          # Base chart components
│   │   ├── chart-container/ # Chart container wrapper
│   │   ├── custom-*/        # Custom chart components
│   │   └── mockData.ts      # Mock data for charts
│   ├── store/               # Redux store configuration
│   │   ├── slices/          # Redux slices
│   │   └── selectors/       # Redux selectors
│   ├── services/            # API services
│   │   └── endpoints/       # API endpoint definitions
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── const/               # Application constants
│   ├── styles/              # Global styles
│   ├── theme/               # Theme configuration
│   ├── providers/           # Context providers
│   ├── routes/              # Routing configuration
│   └── assets/              # Static assets
├── public/                  # Public assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Basic project information
```

## Architecture

### Application Architecture

The application follows a modern React architecture with the following key patterns:

1. **Component-Based Architecture**: Modular, reusable components organized by feature
2. **Redux Toolkit State Management**: Centralized state with RTK Query for API calls
3. **React Router**: Client-side routing with nested routes
4. **Context API**: Theme management and global state
5. **Custom Hooks**: Encapsulated logic for reusability

### Data Flow

```
User Action → Component → Redux Action → Redux Store → API Call → Response → UI Update
```

### Key Architectural Decisions

1. **RTK Query**: Used for API calls with automatic caching and re-fetching
2. **Modular Components**: Components are organized by feature and responsibility
3. **Type Safety**: Full TypeScript implementation for better development experience
4. **Theme Context**: Global theme management with persistence
5. **Route Guards**: Authentication-based route protection

## Core Features

### 1. Dashboard

- **Real-time Monitoring**: Live updates of system status every 30 seconds
- **Interactive Maps**: Google Maps integration showing site locations and alerts
- **Statistics Cards**: Key metrics display (open tickets, closed tickets, success rate)
- **Performance Charts**: Response time and rectification time visualization
- **Asset Management**: Total assets and offline assets tracking

### 2. Alarm Management

- **Alarm Records**: Historical alarm data with filtering and search
- **Self Recovery**: Automated alarm recovery systems
- **Alarm Processing**: Manual alarm processing with status updates
- **Priority Management**: Alarm prioritization and categorization

### 3. Site Management

- **Site Configuration**: Site setup and configuration management
- **Site Map**: Geographic visualization of all sites
- **Site Upgrade**: Firmware and software upgrade management
- **Disconnected Sites**: Monitoring of offline sites

### 4. User Management

- **User Administration**: User creation, editing, and deletion
- **Permission System**: Role-based access control
- **Site Access Control**: Granular site access permissions
- **User Status Management**: Active/inactive user status

### 5. Analytics & Reporting

- **Chart Visualizations**: Multiple chart types for data analysis
- **Historical Data**: Time-based data analysis (24h, 7d, 30d)
- **Performance Metrics**: Response time and system performance tracking
- **Alert Analytics**: Alert patterns and priority analysis

## Component Documentation

### Core Components

#### Dashboard Layout (`src/components/dashboard-layout/`)

The main layout component that provides the application shell including:

- **Header**: Contains user controls, theme switcher, notifications
- **Sidebar**: Navigation menu with collapsible functionality
- **Content Area**: Main content area with breadcrumb navigation

#### Navigation (`src/components/navigation/`)

- **DashboardNavigation**: Main navigation menu with route-based items
- **Breadcrumbs**: Dynamic breadcrumb navigation
- **SiderTrigger**: Collapsible sidebar trigger

#### Theme Components

- **ThemeSwitcher**: Toggle between light and dark themes
- **ThemeContext**: Global theme state management

### Page Components

#### Dashboard (`src/pages/dashboard/`)

The main dashboard page featuring:

- **AlertsMap**: Interactive map showing site locations and alerts
- **StatisticCards**: Key performance indicators
- **PerformanceCharts**: Response time and rectification time charts
- **AssetWidgets**: Asset management and offline monitoring
- **AlertWidgets**: Alert analytics and priority breakdown

#### Alarm Management (`src/pages/alarm-*/`)

- **AlarmRecord**: Historical alarm data with advanced filtering
- **AlarmSelfRecovery**: Automated recovery system management
- **AlarmSelfRecoverySite**: Site-specific recovery management

#### Site Management (`src/pages/site-*/`)

- **SiteConfiguration**: Site setup and configuration
- **SiteMap**: Geographic site visualization
- **SiteUpgrade**: Firmware and software management
- **DisconnectedSites**: Offline site monitoring

### Widget Components

#### Alert Widgets (`src/widgets/alerts-*/`)

- **AlertsByPriority**: Priority-based alert visualization
- **AlertsByType**: Alert type categorization
- **AlertsByVendor**: Vendor-specific alert analysis
- **AlertsMap**: Geographic alert visualization
- **TopAlertsBySite**: Site-specific alert ranking

#### Chart Components (`src/charts/`)

- **BaseAreaChart**: Reusable area chart component
- **BaseBarChart**: Reusable bar chart component
- **BasePieChart**: Reusable pie chart component
- **CustomLegend**: Custom chart legend component
- **CustomTooltip**: Enhanced chart tooltips

## State Management

### Redux Store Structure

The application uses Redux Toolkit with the following store structure:

```typescript
{
  events: EventState,           // Event and alarm data
  authState: AuthState,         // Authentication state
  sites: SiteState,            // Site management state
  filters: FilterState,        // Global filters
  recoveryFilters: RecoveryState, // Recovery system state
  api: ApiState                // RTK Query API state
}
```

### Key Slices

#### Auth Slice (`src/store/slices/authSlice.ts`)

Manages authentication state including:

- **User Information**: User profile and permissions
- **Token Management**: JWT token handling with localStorage persistence
- **Login/Logout**: Authentication actions
- **Permission Management**: User role and site access permissions

#### Events Slice (`src/store/slices/events.ts`)

Handles event and alarm data:

- **Event Data**: Real-time event information
- **Filter State**: Event filtering and search
- **Modal State**: Event processing modals

#### Sites Slice (`src/store/slices/sites.ts`)

Manages site-related state:

- **Site Data**: Site information and configuration
- **Selected Site**: Currently selected site for detailed views
- **Site Filters**: Site-specific filtering

### RTK Query Integration

The application uses RTK Query for API calls with the following features:

- **Automatic Caching**: Efficient data caching and re-fetching
- **Real-time Updates**: Polling for live data updates
- **Error Handling**: Centralized error handling and retry logic
- **Token Refresh**: Automatic token refresh on 401 errors

## API Integration

### API Configuration (`src/services/api.ts`)

The API layer is built using RTK Query with the following features:

#### Base Configuration

- **Base URL**: Configurable API base URL from environment variables
- **Authentication**: Automatic token inclusion in headers
- **Error Handling**: Centralized error handling with automatic logout
- **Token Refresh**: Automatic token refresh on authentication errors

#### Endpoint Categories

1. **Authentication Endpoints**

   - Login/Logout
   - Token refresh
   - User registration

2. **User Management Endpoints**

   - User CRUD operations
   - Permission management
   - Site access control

3. **Site Management Endpoints**

   - Site CRUD operations
   - Site configuration
   - Firmware upgrades

4. **Event Management Endpoints**

   - Event querying and filtering
   - Event processing
   - Real-time event updates

5. **Statistics Endpoints**
   - Dashboard statistics
   - Chart data
   - Performance metrics

### API Response Handling

The application implements sophisticated API response handling:

- **Error Mapping**: Consistent error handling across all endpoints
- **Loading States**: Proper loading state management
- **Data Transformation**: Automatic data transformation for UI consumption
- **Caching Strategy**: Intelligent caching for performance optimization

## Routing

### Route Structure (`src/routes/`)

The application uses React Router v6 with the following route structure:

```typescript
/                           # Home (redirects to dashboard)
/login                      # Authentication page
/dashboard                  # Main dashboard
/users                      # User management
/alarm/                     # Alarm management routes
  ├── record               # Alarm records
  ├── self-recovery        # Self recovery
  └── self-recovery-site   # Site-specific recovery
/site-map                   # Geographic site map
/site-configuration         # Site configuration
/site-upgrade              # Site upgrade management
/masked-source             # Masked source management
/disconnected-sites        # Offline sites monitoring
/alert-map                 # Alert map with filters
```

### Route Guards

The application implements authentication-based route protection:

- **AuthGuard**: Prevents authenticated users from accessing login page
- **AuthProvider**: Provides authentication context to protected routes
- **Permission Guards**: Role-based access control for specific features

### Dynamic Routing

The application supports dynamic routing with:

- **Query Parameters**: URL-based filtering and search
- **Dynamic Breadcrumbs**: Context-aware breadcrumb navigation
- **Modal Routes**: Modal-based navigation for detailed views

## Authentication & Authorization

### Authentication Flow

1. **Login Process**

   - User submits credentials
   - Server validates and returns JWT token
   - Token stored in localStorage
   - User redirected to dashboard

2. **Token Management**

   - Automatic token inclusion in API requests
   - Token refresh on 401 errors
   - Automatic logout on authentication failure

3. **Session Persistence**
   - User data persisted in localStorage
   - Automatic session restoration on page reload
   - Secure token storage

### Authorization System

#### Role-Based Access Control

- **Admin Role (99)**: Full system access
- **User Role**: Limited access based on permissions
- **Site-Specific Access**: Granular site access control

#### Permission Management

- **User Permissions**: Individual user permission management
- **Site Access**: Site-specific access control
- **Feature Access**: Feature-level permission control

## Theming & Styling

### Theme System

The application implements a comprehensive theming system:

#### Theme Context (`src/theme/`)

- **Theme State**: Global theme state management
- **Theme Persistence**: Cookie-based theme persistence
- **Theme Toggle**: Dynamic theme switching

#### Theme Configuration

- **Light Theme**: Default light theme with custom colors
- **Dark Theme**: Dark theme with inverted colors
- **Custom Tokens**: Ant Design token customization

### Styling Approach

#### CSS Modules

- **Scoped Styling**: Component-specific CSS modules
- **Naming Convention**: `[folder]_[local]__[hash:base64:5]`
- **Global Styles**: Global CSS for common styles

#### Ant Design Integration

- **Component Theming**: Ant Design component customization
- **Token System**: Design token-based theming
- **Responsive Design**: Mobile-first responsive design

### Color Scheme

#### Light Theme

- **Primary**: Blue (#1890ff)
- **Background**: White (#ffffff)
- **Text**: Dark gray (#262626)
- **Border**: Light gray (#d9d9d9)

#### Dark Theme

- **Primary**: Blue (#1890ff)
- **Background**: Dark gray (#141414)
- **Text**: Light gray (#ffffff)
- **Border**: Dark gray (#303030)

## Development Guidelines

### Code Style

#### TypeScript Guidelines

- **Strict Mode**: Full TypeScript strict mode enabled
- **Type Definitions**: Comprehensive type definitions in `src/types/`
- **Interface Naming**: PascalCase for interfaces and types
- **Import Organization**: Organized imports with path aliases

#### React Guidelines

- **Functional Components**: Use functional components with hooks
- **Component Naming**: PascalCase for component names
- **Props Interface**: Define props interfaces for all components
- **Custom Hooks**: Extract reusable logic into custom hooks

#### File Organization

- **Feature-Based**: Organize files by feature rather than type
- **Index Files**: Use index files for clean imports
- **Path Aliases**: Use `@/` alias for src directory imports

### Naming Conventions

#### Files and Directories

- **Components**: PascalCase (e.g., `DashboardLayout.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAppSelector.ts`)
- **Utilities**: camelCase (e.g., `general-helpers.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

#### Variables and Functions

- **Variables**: camelCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

### Performance Guidelines

#### Optimization Strategies

- **React.memo**: Use for expensive components
- **useMemo/useCallback**: Optimize expensive calculations and callbacks
- **Lazy Loading**: Implement code splitting for large components
- **Debouncing**: Use debouncing for search and filter operations

#### Bundle Optimization

- **Tree Shaking**: Remove unused code
- **Code Splitting**: Split code by routes and features
- **Asset Optimization**: Optimize images and static assets

## Testing

### Testing Framework

The application uses Vitest for testing with the following setup:

#### Test Configuration (`vitest.config.ts`)

- **Environment**: jsdom for DOM testing
- **Coverage**: Comprehensive test coverage
- **Mocking**: API mocking for isolated testing

#### Test Structure

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API integration tests
- **Snapshot Tests**: UI component snapshot testing

### Testing Guidelines

#### Component Testing

- **Render Testing**: Test component rendering
- **User Interaction**: Test user interactions and events
- **State Testing**: Test component state changes
- **Props Testing**: Test component prop handling

#### API Testing

- **Mock API Calls**: Mock API responses for testing
- **Error Handling**: Test error scenarios
- **Loading States**: Test loading state handling

## Build & Deployment

### Development Environment

#### Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Run tests
yarn test

# Lint code
yarn lint
```

#### Environment Configuration

- **Development**: Uses Vite dev server with hot reload
- **API Proxy**: Development proxy for API calls
- **Environment Variables**: Configured via `.env` files

### Production Build

#### Build Process

```bash
# Build for production
yarn build

# Preview production build
yarn preview
```

#### Build Configuration (`vite.config.ts`)

- **Output Directory**: `build/`
- **Asset Optimization**: Automatic asset optimization
- **Code Splitting**: Automatic code splitting
- **Source Maps**: Production source maps

### Deployment

#### Vercel Deployment (`vercel.json`)

- **Static Site**: Configured for static site deployment
- **SPA Routing**: Client-side routing support
- **Environment Variables**: Production environment configuration

#### Environment Variables

- **VITE_APP_API_BASE_URL**: API base URL
- **Development/Production**: Different configurations for each environment

## Troubleshooting

### Common Issues

#### Development Issues

1. **Port Conflicts**: Change port in `vite.config.ts`
2. **API Connection**: Check API base URL configuration
3. **Type Errors**: Ensure all types are properly defined
4. **Build Errors**: Check for missing dependencies

#### Runtime Issues

1. **Authentication**: Clear localStorage for auth issues
2. **Theme Issues**: Clear cookies for theme problems
3. **API Errors**: Check network connectivity and API status
4. **Performance**: Monitor bundle size and optimize

### Debug Tools

#### Development Tools

- **React DevTools**: Component inspection and debugging
- **Redux DevTools**: State management debugging
- **Network Tab**: API call monitoring
- **Console Logs**: Application logging

#### Performance Monitoring

- **Bundle Analyzer**: Analyze bundle size
- **Performance Profiling**: React performance profiling
- **Memory Leaks**: Monitor for memory leaks
- **API Performance**: Monitor API response times

### Support Resources

#### Documentation

- **Component Documentation**: Inline component documentation
- **API Documentation**: Endpoint documentation
- **Type Definitions**: Comprehensive TypeScript types
- **Code Comments**: Detailed code comments

#### Development Resources

- **Git Repository**: Version control and collaboration
- **Issue Tracking**: Bug reporting and feature requests
- **Code Review**: Peer review process
- **Continuous Integration**: Automated testing and deployment

---

This documentation provides a comprehensive overview of the Service Plus Frontend application. For specific implementation details, refer to the individual component files and their inline documentation. The application is designed to be scalable, maintainable, and user-friendly while providing powerful monitoring and management capabilities for distributed systems.
