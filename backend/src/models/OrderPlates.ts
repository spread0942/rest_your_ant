import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OrderPlatesAttributes {
  id: number;
  orderId: number;
  lineId: number;
  plateId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderPlatesCreationAttributes extends Optional<OrderPlatesAttributes, 'id' | 'lineId' | 'createdAt' | 'updatedAt'> {}

class OrderPlates extends Model<OrderPlatesAttributes, OrderPlatesCreationAttributes> implements OrderPlatesAttributes {
  public id!: number;
  public orderId!: number;
  public lineId!: number;
  public plateId!: number;
  public quantity!: number;
  public unitPrice!: number;
  public subtotal!: number;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderPlates.init(
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
    plateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'plates',
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
    tableName: 'orders_plates',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['orderId', 'lineId'],
      },
    ],
    hooks: {
      beforeValidate: async (orderPlates: OrderPlates) => {
        if (!orderPlates.lineId) {
          const maxLineId = await OrderPlates.max('lineId', {
            where: { orderId: orderPlates.orderId }
          }) as number;
          orderPlates.lineId = (maxLineId || 0) + 1;
        }
      },
    },
  }
);

export default OrderPlates;
