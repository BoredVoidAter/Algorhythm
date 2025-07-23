const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobListing = sequelize.define('JobListing', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  skillsRequired: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = JobListing;