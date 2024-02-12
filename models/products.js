'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {

    static associate(models) {
      // define association here
      // Define one-to-many relationship with ProductSale
    }
  }
  
  Products.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    inventory: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Products',
    tableName: "products",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Products;
};