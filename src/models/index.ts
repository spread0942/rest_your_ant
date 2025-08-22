import Account from './Account';
import Restaurant from './Restaurant';
import Menu from './Menu';
import Plate from './Plate';
import Product from './Product';
import Drink from './Drink';
import Table from './Table';
import Order from './Order';
import MenuPlate from './MenuPlate';
import PlateProduct from './PlateProduct';
import MenuDrink from './MenuDrink';
import OrderDetail from './OrderDetail';

// Restaurant associations
Restaurant.hasMany(Menu, { foreignKey: 'restaurantId', as: 'menus' });
Menu.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Restaurant.hasMany(Table, { foreignKey: 'restaurantId', as: 'tables' });
Table.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Restaurant.hasMany(Order, { foreignKey: 'restaurantId', as: 'orders' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// Account associations
Account.hasMany(Order, { foreignKey: 'accountId', as: 'orders' });
Order.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

// Table associations
Table.hasMany(Order, { foreignKey: 'tableId', as: 'orders' });
Order.belongsTo(Table, { foreignKey: 'tableId', as: 'table' });

// Order associations
Order.hasMany(OrderDetail, { foreignKey: 'orderId', as: 'details' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Plate associations
Plate.hasMany(OrderDetail, { foreignKey: 'plateId', as: 'orderDetails' });
OrderDetail.belongsTo(Plate, { foreignKey: 'plateId', as: 'plate' });

// Drink associations
Drink.hasMany(OrderDetail, { foreignKey: 'drinkId', as: 'orderDetails' });
OrderDetail.belongsTo(Drink, { foreignKey: 'drinkId', as: 'drink' });

// Many-to-many: Menu <-> Plate through MenuPlate
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

// Direct associations for junction table
Menu.hasMany(MenuPlate, { foreignKey: 'menuId', as: 'menuPlates' });
MenuPlate.belongsTo(Menu, { foreignKey: 'menuId', as: 'menu' });
Plate.hasMany(MenuPlate, { foreignKey: 'plateId', as: 'menuPlates' });
MenuPlate.belongsTo(Plate, { foreignKey: 'plateId', as: 'plate' });

// Many-to-many: Plate <-> Product through PlateProduct
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
Plate.hasMany(PlateProduct, { foreignKey: 'plateId', as: 'plateProducts' });
PlateProduct.belongsTo(Plate, { foreignKey: 'plateId', as: 'plate' });
Product.hasMany(PlateProduct, { foreignKey: 'productId', as: 'plateProducts' });
PlateProduct.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Many-to-many: Menu <-> Drink through MenuDrink
Menu.belongsToMany(Drink, { 
  through: MenuDrink, 
  foreignKey: 'menuId', 
  otherKey: 'drinkId',
  as: 'drinks' 
});
Drink.belongsToMany(Menu, { 
  through: MenuDrink, 
  foreignKey: 'drinkId', 
  otherKey: 'menuId',
  as: 'menus' 
});

// Direct associations for junction table
Menu.hasMany(MenuDrink, { foreignKey: 'menuId', as: 'menuDrinks' });
MenuDrink.belongsTo(Menu, { foreignKey: 'menuId', as: 'menu' });
Drink.hasMany(MenuDrink, { foreignKey: 'drinkId', as: 'menuDrinks' });
MenuDrink.belongsTo(Drink, { foreignKey: 'drinkId', as: 'drink' });

export {
  Account,
  Restaurant,
  Menu,
  Plate,
  Product,
  Drink,
  Table,
  Order,
  MenuPlate,
  PlateProduct,
  MenuDrink,
  OrderDetail,
};

export default {
  Account,
  Restaurant,
  Menu,
  Plate,
  Product,
  Drink,
  Table,
  Order,
  MenuPlate,
  PlateProduct,
  MenuDrink,
  OrderDetail,
};
