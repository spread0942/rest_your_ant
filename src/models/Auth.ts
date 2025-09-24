import Account from './Account';
import User from './User';

// create a class without creating it in the database
class Auth {
  id!: Account['id'];
  email!: Account['email'];
  tenants: { id: number; role: string }[] = [];

  constructor(account?: Account, users?: User[]) {
    if (account && users) {
      this.id = account.id;
      this.email = account.email;
      this.tenants = users.map(user => ({
        id: user.tenantId,
        role: user.role,
      }));
    }
  }
}

export default Auth;