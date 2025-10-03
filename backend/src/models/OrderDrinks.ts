import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OrderDrinksAttributes {
  id: number;
  orderId: number;
  lineId: number;
  drinkId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderDrinksCreationAttributes extends Optional<OrderDrinksAttributes, 'id' | 'lineId' | 'createdAt' | 'updatedAt'> {}

class OrderDrinks extends Model<OrderDrinksAttributes, OrderDrinksCreationAttributes> implements OrderDrinksAttributes {
  public id!: number;
  public orderId!: number;
  public lineId!: number;
  public drinkId!: number;
  public quantity!: number;
  public unitPrice!: number;
  public subtotal!: number;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderDrinks.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    lineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    drinkId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'drinks',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unitPrice: {
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
    tableName: 'orders_drinks',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['orderId', 'lineId'],
      },
    ],
    hooks: {
      beforeValidate: async (orderPlates: OrderDrinks) => {
        if (!orderPlates.lineId) {
          // Get the next lineId for this orderId
          const maxLineId = await OrderDrinks.max('lineId', {
            where: { orderId: orderPlates.orderId }
          }) as number;
          orderPlates.lineId = (maxLineId || 0) + 1;
        }
      },
    },
  }
);

export default OrderDrinks;
