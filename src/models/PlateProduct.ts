import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlateProductAttributes {
  id: number;
  plateId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PlateProductCreationAttributes extends Optional<PlateProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class PlateProduct extends Model<PlateProductAttributes, PlateProductCreationAttributes> implements PlateProductAttributes {
  public id!: number;
  public plateId!: number;
  public productId!: number;
  public quantity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlateProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    plateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'plates',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'plates_products',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['plateId', 'productId'],
      },
    ],
  }
);

export default PlateProduct;
