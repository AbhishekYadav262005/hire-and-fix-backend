
class OTPStore {
  constructor() {
    this.store = new Map();
  }

  set(email, otpData) {
    this.store.set(email, otpData);
  }

  
  get(email) {
    return this.store.get(email);
  }

  delete(email) {
    this.store.delete(email);
  }


  isValid(email) {
    const otpData = this.store.get(email);
    if (!otpData) return false;

    if (otpData.expiresAt < Date.now()) {
      this.delete(email);
      return false;
    }
    return true;
  }
}

module.exports = new OTPStore();
