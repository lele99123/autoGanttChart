# 学习计划甘特图生成器 (Study Plan Gantt Chart Generator)

An application for creating and managing study plans with Gantt chart visualization.

## Features

- Create and manage study plans
- Organize tasks by subject and chapter
- Set difficulty levels for study topics
- Visualize plans with Gantt charts
- Export data to CSV

## Technologies

- Electron for desktop application
- Express.js for backend server
- SQLite for database
- HTML/CSS/JavaScript for frontend

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Usage

### Development Mode

Run the Express server:

```bash
npm run dev
```

Run with Electron:

```bash
npm run electron-dev
```

### Production Build

Create a packaged application:

```bash
npm run dist
```

This will create installers in the `dist` folder.

## Notes for Customization

- Add custom icons:
  - For Windows: Add `icon.ico` in the root directory
  - For macOS: Add `icon.icns` in the root directory

## License

This software is provided as-is without any guarantees or warranty. 