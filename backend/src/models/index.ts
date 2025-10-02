import Account from './Account';
import Auth from './Auth';
import Drink from './Drink';
import Menu from './Menu';
import MenuPlate from './MenuPlate';
import Order from './Order';
import OrderDetail from './OrderDetail';
import Plate from './Plate';
import PlateProduct from './PlateProduct';
import Product from './Product';
import Restaurant from './Restaurant';
import Table from './Table';
import Tenant from './Tenant';

// Drink associations
Drink.hasMany(OrderDetail, { foreignKey: 'drinkId', as: 'orderDetails' });
OrderDetail.belongsTo(Drink, { foreignKey: 'drinkId', as: 'drink' });

// Order associations
Order.hasMany(OrderDetail, { foreignKey: 'orderId', as: 'details' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Plate associations
Plate.hasMany(OrderDetail, { foreignKey: 'plateId', as: 'orderDetails' });
OrderDetail.belongsTo(Plate, { foreignKey: 'plateId', as: 'plate' });

// Restaurant associations
Restaurant.hasMany(Menu, { foreignKey: 'restaurantId', as: 'menus' });
Menu.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Restaurant.hasMany(Plate, { foreignKey: 'restaurantId', as: 'plates' });
Plate.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Restaurant.hasMany(Product, { foreignKey: 'restaurantId', as: 'products' });
Product.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Restaurant.hasMany(Table, { foreignKey: 'restaurantId', as: 'tables' });
Table.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Restaurant.hasMany(Order, { foreignKey: 'restaurantId', as: 'orders' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// Table associations
Table.hasMany(Order, { foreignKey: 'tableId', as: 'orders' });
Order.belongsTo(Table, { foreignKey: 'tableId', as: 'table' });

// Menu <-> Plate through MenuPlate (many-to-many through MenuPlate)
// Direct associations for junction table
Menu.hasMany(MenuPlate, { foreignKey: 'menuId', as: 'menuPlates' });
MenuPlate.belongsTo(Menu, { foreignKey: 'menuId', as: 'menu' });
Plate.hasMany(MenuPlate, { foreignKey: 'plateId', as: 'menuPlates' });
MenuPlate.belongsTo(Plate, { foreignKey: 'plateId', as: 'plate' });

// Many-to-many
Menu.belongsToMany(Plate, { 
  through: MenuPlate, 
  foreignKey: 'menuId', 
  otherKey: 'plateId',
  as: 'plates' 
});
Plate.belongsToMany(Menu, { 
  through: MenuPlate, 
  foreignKey: 'plateId', 
  otherKey: 'menuId',
  as: 'menus' 
});

// Plate <-> Product through PlateProduct (many-to-many through PlateProduct)
// Direct associations for junction table
Plate.hasMany(PlateProduct, { foreignKey: 'plateId', as: 'plateProducts' });
PlateProduct.belongsTo(Plate, { foreignKey: 'plateId', as: 'plate' });
Product.hasMany(PlateProduct, { foreignKey: 'productId', as: 'plateProducts' });
PlateProduct.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Many-to-many
Plate.belongsToMany(Product, { 
  through: PlateProduct, 
  foreignKey: 'plateId', 
  otherKey: 'productId',
  as: 'products' 
});
Product.belongsToMany(Plate, { 
  through: PlateProduct, 
  foreignKey: 'productId', 
  otherKey: 'plateId',
  as: 'plates' 
});

// Direct associations for junction table
Drink.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
Restaurant.hasMany(Drink, { foreignKey: 'restaurantId', as: 'drinks' });

// Tenant associations
Tenant.hasMany(Account, { foreignKey: 'tenantId', as: 'accounts' });
Account.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

export {
  // db models
  Account,
  Restaurant,
  Menu,
  MenuPlate,
  Plate,
  Product,
  Drink,
  Table,
  Order,
  PlateProduct,
  OrderDetail,
  Tenant,
  // class models
  Auth,
};

export default {
  // db models
  Account,
  Restaurant,
  Menu,
  MenuPlate,
  Plate,
  Product,
  Drink,
  Table,
  Order,
  PlateProduct,
  OrderDetail,
  Tenant,
  // class models
  Auth,
};
