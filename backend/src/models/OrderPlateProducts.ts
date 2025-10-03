import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OrderPlateProductsAttributes {
    id: number;
    orderPlateId: number;
    quantity: number;
    price: number;
    subtotal: number;
    action: 'add' | 'remove';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface OrderPlateProductsCreationAttributes extends Optional<OrderPlateProductsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class OrderPlateProducts extends Model<OrderPlateProductsAttributes, OrderPlateProductsCreationAttributes> implements OrderPlateProductsAttributes {
    public id!: number;
    public orderPlateId!: number;
    public quantity!: number;
    public price!: number;
    public subtotal!: number;
    public action!: 'add' | 'remove';
    public notes?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

OrderPlateProducts.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    orderPlateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders_plates',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    action: {
      type: DataTypes.ENUM('add', 'remove'),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'order_plate_products',
    timestamps: true,
  }
);

export default OrderPlateProducts;
