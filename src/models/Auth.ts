import Account from './Account';

// create a class without creating it in the database
class Auth {
  id!: Account['id'];
  email!: Account['email'];
  tenantId!: Account['tenantId'];
  role!: Account['role'];

  constructor(account?: Account) {
    if (account) {
      this.id = account.id;
      this.email = account.email;
      this.tenantId = account.tenantId;
      this.role = account.role;
    }
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      tenantId: this.tenantId,
      role: this.role
    };
  }
}

export default Auth;