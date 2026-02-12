const STORAGE_KEYS = {
  TOKEN: 'token',
  CART: 'cartItems',
  USER: 'user',
  WISHLIST: 'wishlist',
  ADDRESSES: 'savedAddresses'
};

export const storage = {
  setToken: (token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  removeToken: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  setCart: (cart) => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  getCart: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || {};
    } catch {
      return {};
    }
  },

  clearCart: () => {
    localStorage.removeItem(STORAGE_KEYS.CART);
  },

  setUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    } catch {
      return null;
    }
  },

  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  setWishlist: (wishlist) => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  },

  getWishlist: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
    } catch {
      return [];
    }
  },

  addToWishlist: (itemId) => {
    const wishlist = storage.getWishlist();
    if (!wishlist.includes(itemId)) {
      wishlist.push(itemId);
      storage.setWishlist(wishlist);
    }
  },

  removeFromWishlist: (itemId) => {
    const wishlist = storage.getWishlist();
    const updated = wishlist.filter(id => id !== itemId);
    storage.setWishlist(updated);
  },

  isInWishlist: (itemId) => {
    return storage.getWishlist().includes(itemId);
  },

  setAddresses: (addresses) => {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
  },

  getAddresses: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADDRESSES)) || [];
    } catch {
      return [];
    }
  },

  addAddress: (address) => {
    const addresses = storage.getAddresses();
    addresses.push({ ...address, id: Date.now() });
    storage.setAddresses(addresses);
    return addresses;
  },

  removeAddress: (addressId) => {
    const addresses = storage.getAddresses();
    const updated = addresses.filter(addr => addr.id !== addressId);
    storage.setAddresses(updated);
    return updated;
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
