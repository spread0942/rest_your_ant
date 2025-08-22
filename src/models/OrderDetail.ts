import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OrderDetailAttributes {
  id: number;
  orderId: number;
  plateId?: number;
  drinkId?: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderDetailCreationAttributes extends Optional<OrderDetailAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class OrderDetail extends Model<OrderDetailAttributes, OrderDetailCreationAttributes> implements OrderDetailAttributes {
  public id!: number;
  public orderId!: number;
  public plateId?: number;
  public drinkId?: number;
  public quantity!: number;
  public unitPrice!: number;
  public subtotal!: number;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderDetail.init(
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
    },
    plateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'plates',
        key: 'id',
      },
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
    tableName: 'orders_details',
    timestamps: true,
    validate: {
      eitherPlateOrDrink() {
        if (!this.plateId && !this.drinkId) {
          throw new Error('Either plateId or drinkId must be provided');
        }
        if (this.plateId && this.drinkId) {
          throw new Error('Cannot have both plateId and drinkId');
        }
      },
    },
  }
);

export default OrderDetail;
