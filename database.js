const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// 获取应用程序根目录
const getAppPath = () => {
    // 在 NW.js 环境中，process.cwd() 会返回应用程序的根目录
    return process.cwd();
};

// Create a SQLite database in the project directory
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(getAppPath(), 'database.sqlite'),
    logging: false // Set to console.log to see SQL queries
});

// Test the database connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Initialize the database
async function initDatabase() {
    try {
        // Import models
        const { StudyPlan, StudyTask, Subject, Chapter } = require('./models');
        
        // Define associations
        StudyPlan.hasMany(StudyTask, { foreignKey: 'planId', onDelete: 'CASCADE' });
        StudyTask.belongsTo(StudyPlan, { foreignKey: 'planId' });
        
        Subject.hasMany(Chapter, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
        Chapter.belongsTo(Subject, { foreignKey: 'subjectId' });
        
        // Sync the database (create tables if they don't exist)
        await sequelize.sync();
        console.log('Database synchronized successfully.');
        
        // Check if subjects exist, if not, seed from subjects.json
        const subjectCount = await Subject.count();
        if (subjectCount === 0) {
            const subjectsPath = path.join(getAppPath(), 'subjects.json');
            console.log('Loading subjects from:', subjectsPath);
            
            if (!fs.existsSync(subjectsPath)) {
                throw new Error(`subjects.json not found at ${subjectsPath}`);
            }
            
            const subjectsData = JSON.parse(fs.readFileSync(subjectsPath, 'utf8'));
            
            for (const subjectData of subjectsData.subjects) {
                const subject = await Subject.create({ name: subjectData.name });
                
                for (const chapterName of subjectData.chapters) {
                    await Chapter.create({
                        name: chapterName,
                        subjectId: subject.id
                    });
                }
            }
            console.log('Initial subjects and chapters data loaded.');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error; // 重新抛出错误以便上层处理
    }
}

module.exports = {
    sequelize,
    testConnection,
    initDatabase
};
