import Account from './Account';
import Auth from './Auth';
import Drink from './Drink';
import Menu from './Menu';
import MenuPlate from './MenuPlate';
import Order from './Order';
import OrderDrinks from './OrderDrinks';
import OrderPlateProducts from './OrderPlateProducts';
import OrderPlates from './OrderPlates';
import Plate from './Plate';
import PlateProduct from './PlateProduct';
import Product from './Product';
import Restaurant from './Restaurant';
import Table from './Table';
import Tenant from './Tenant';

// Restaurant associations
Restaurant.hasMany(Menu, { foreignKey: 'restaurantId', as: 'menus' });
Menu.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Restaurant.hasMany(Plate, { foreignKey: 'restaurantId', as: 'plates' });
Plate.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Restaurant.hasMany(Product, { foreignKey: 'restaurantId', as: 'products' });
Product.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Restaurant.hasMany(Table, { foreignKey: 'restaurantId', as: 'tables' });
Table.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

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

// Order associations
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
Restaurant.hasMany(Order, { foreignKey: 'restaurantId', as: 'orders' });

Order.belongsTo(Table, { foreignKey: 'tableId', as: 'table' });
Table.hasMany(Order, { foreignKey: 'tableId', as: 'orders' });

Order.hasMany(OrderPlates, { foreignKey: 'orderId', as: 'orderPlates' });
OrderPlates.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

OrderPlates.belongsTo(Plate, { foreignKey: 'plateId', as: 'plate' });
Plate.hasMany(OrderPlates, { foreignKey: 'plateId', as: 'orderPlates' });

Order.hasMany(OrderDrinks, { foreignKey: 'orderId', as: 'orderDrinks' });
OrderDrinks.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

OrderDrinks.belongsTo(Drink, { foreignKey: 'drinkId', as: 'drink' });
Drink.hasMany(OrderDrinks, { foreignKey: 'drinkId', as: 'orderDrinks' });

OrderPlates.hasMany(OrderPlateProducts, { foreignKey: 'orderPlateId', as: 'orderPlateProducts' });
OrderPlateProducts.belongsTo(OrderPlates, { foreignKey: 'orderPlateId', as: 'orderPlate' });

OrderPlateProducts.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderPlateProducts, { foreignKey: 'productId', as: 'orderPlateProducts' });

export {
  // db models
  Account,
  Drink,
  Menu,
  MenuPlate,
  Order,
  OrderDrinks,
  OrderPlateProducts,
  OrderPlates,
  Plate,
  PlateProduct,
  Product,
  Restaurant,
  Table,
  Tenant,
  // class models
  Auth,
};

export default {
  // db models
  Account,
  Drink,
  Menu,
  MenuPlate,
  Order,
  OrderDrinks,
  OrderPlateProducts,
  OrderPlates,
  Plate,
  PlateProduct,
  Product,
  Restaurant,
  Table,
  Tenant,
  // class models
  Auth,
};
