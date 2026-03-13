import type { User, Property } from './types';

const USERS_KEY = 'osun_real_estate_users';
const PROPERTIES_KEY = 'osun_real_estate_properties';
const CURRENT_USER_KEY = 'osun_real_estate_current_user';

// User management
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Property management
export const getProperties = (): Property[] => {
  if (typeof window === 'undefined') return [];
  const properties = localStorage.getItem(PROPERTIES_KEY);
  return properties ? JSON.parse(properties) : [];
};

export const saveProperty = (property: Property): void => {
  const properties = getProperties();
  properties.push(property);
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
};

export const updateProperty = (id: string, updatedProperty: Property): void => {
  const properties = getProperties();
  const index = properties.findIndex(p => p.id === id);
  if (index !== -1) {
    properties[index] = updatedProperty;
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
  }
};

export const deleteProperty = (id: string): void => {
  const properties = getProperties();
  const filtered = properties.filter(p => p.id !== id);
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(filtered));
};

export const getPropertyById = (id: string): Property | undefined => {
  const properties = getProperties();
  return properties.find(p => p.id === id);
};

export const getPropertiesByOwner = (ownerId: string): Property[] => {
  const properties = getProperties();
  return properties.filter(p => p.ownerId === ownerId);
};
