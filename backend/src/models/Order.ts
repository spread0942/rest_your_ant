import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OrderAttributes {
  id: number;
  nOrder: number;
  year: number;
  restaurantId: number;
  tableId?: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  totalAmount: number;
  notes?: string;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'nOrder' | 'year' | 'orderDate' | 'createdAt' | 'updatedAt'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public nOrder!: number;
  public year!: number;
  public restaurantId!: number;
  public tableId?: number;
  public status!: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  public totalAmount!: number;
  public notes?: string;
  public orderDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 2000,
      },
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'restaurants',
        key: 'id',
      },
    },
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tables',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'preparing', 'ready', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: 'orders',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['nOrder', 'year', 'restaurantId'],
      },
    ],
    hooks: {
      beforeValidate: async (order) => {
        // Set year if not provided
        if (!order.year) {
          order.year = new Date().getFullYear();
        }
        
        // Set nOrder if not provided
        if (!order.nOrder) {
          const maxOrder = await Order.findOne({
            where: { 
              year: order.year, 
              restaurantId: order.restaurantId 
            },
            order: [['nOrder', 'DESC']],
            attributes: ['nOrder'],
          });
          order.nOrder = maxOrder ? maxOrder.nOrder + 1 : 1;
        }
      },
    },
  }
);

export default Order;
