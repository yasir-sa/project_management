const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { rejectUnauthorized: false } },
  logging: false,
});

const Admin = sequelize.define('Admin', {
  name:     { type: DataTypes.STRING, allowNull: false },
  email:    { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'admins' });

const Employee = sequelize.define('Employee', {
  name:       { type: DataTypes.STRING, allowNull: false },
  email:      { type: DataTypes.STRING, allowNull: false, unique: true },
  password:   { type: DataTypes.STRING, allowNull: false },
  phone:      { type: DataTypes.STRING, defaultValue: '' },
  department: { type: DataTypes.STRING, defaultValue: '' },
  isActive:   { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'employees' });

const Project = sequelize.define('Project', {
  title:       { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  dueDate:     { type: DataTypes.DATEONLY, allowNull: false },
  status:      { type: DataTypes.ENUM('pending', 'in-progress', 'completed'), defaultValue: 'pending' },
  employeeId:  { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'projects' });

const Message = sequelize.define('Message', {
  content:    { type: DataTypes.TEXT, allowNull: false },
  senderType: { type: DataTypes.ENUM('admin', 'employee'), allowNull: false },
  senderId:   { type: DataTypes.INTEGER, allowNull: false },
  employeeId: { type: DataTypes.INTEGER, allowNull: false },
  isRead:     { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'messages' });

Project.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasMany(Project,   { foreignKey: 'employeeId', as: 'projects' });
Message.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log('All tables synced!');
};

module.exports = { sequelize, Admin, Employee, Project, Message, syncDB };
