const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { testConnection, initDatabase } = require('./database');

// 获取应用程序根目录
const getAppPath = () => {
    return process.cwd();
};

// 确保所需的文件存在
function checkRequiredFiles() {
    const files = [
        'subjects.json',
        'autoGanttChart.html',
        'models/index.js',
        'routes/subjects.js',
        'routes/plans.js',
        'routes/tasks.js'
    ];
    
    for (const file of files) {
        const filePath = path.join(getAppPath(), file);
        console.log(`检查文件: ${filePath}`);
        if (!fs.existsSync(filePath)) {
            throw new Error(`找不到必需的文件: ${file}`);
        }
    }
    console.log('所有必需的文件都已找到');
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Import routes - 增加错误处理
let plansRoutes, tasksRoutes, subjectsRoutes;
try {
    plansRoutes = require('./routes/plans');
    tasksRoutes = require('./routes/tasks');
    subjectsRoutes = require('./routes/subjects');
    console.log('路由模块加载成功');
} catch (error) {
    console.error('加载路由模块失败:', error);
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(getAppPath()));

// API routes
app.use('/api/plans', plansRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/subjects', subjectsRoutes);

// 直接从subjects.json获取学科数据的备用路由
app.get('/api/subjects-direct', (req, res) => {
    try {
        const subjectsPath = path.join(getAppPath(), 'subjects.json');
        if (!fs.existsSync(subjectsPath)) {
            return res.status(404).json({ error: 'subjects.json 文件不存在' });
        }
        
        const subjectsData = JSON.parse(fs.readFileSync(subjectsPath, 'utf8'));
        res.json(subjectsData);
    } catch (error) {
        console.error('直接获取学科数据失败:', error);
        res.status(500).json({ error: '获取学科数据失败: ' + error.message });
    }
});

// Route to save subjects.json file
app.post('/api/save-subjects-json', (req, res) => {
    try {
        const data = req.body;
        const subjectsPath = path.join(getAppPath(), 'subjects.json');
        fs.writeFileSync(subjectsPath, JSON.stringify(data, null, 2));
        res.status(200).json({ message: 'Subjects data saved successfully' });
    } catch (error) {
        console.error('Error saving subjects.json:', error);
        res.status(500).json({ error: 'Failed to save subjects data' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(getAppPath(), 'autoGanttChart.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器错误: ' + err.message });
});

// Initialize database and start server
async function startServer() {
    try {
        console.log('应用根目录:', getAppPath());
        // 检查必需的文件
        checkRequiredFiles();
        
        // Test database connection
        await testConnection();
        
        // Initialize database (create tables and seed data)
        await initDatabase();
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
