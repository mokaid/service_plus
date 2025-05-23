# Service Plus Frontend

A modern frontend project built with [React](https://react.dev/), [Vite](https://vitejs.dev/), and [TypeScript](https://www.typescriptlang.org/). It uses [Ant Design](https://ant.design/) for UI, [Redux Toolkit](https://redux-toolkit.js.org/) for state management, and [Vitest](https://vitest.dev/) for testing.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

## Getting Started

### Install dependencies
```bash
yarn install
# or
npm install
```

### Run the development server
```bash
yarn start
# or
npm start
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### Build for production
```bash
yarn build
# or
npm run build
```
The production-ready files will be in the `build/` directory.

## Project Structure
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── store/           # Redux store setup
│   ├── services/        # API and service logic
│   ├── utils/           # Utility functions
│   └── main.tsx         # App entry point
├── public/
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── ...
```

---

