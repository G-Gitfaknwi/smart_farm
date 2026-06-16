import { createClient } from '../supabase/client';

const supabase = createClient();

// Helper to determine if we are using Supabase or local mock storage
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes('placeholder-url'));
}

// Define storage keys
const KEYS = {
  FIELDS: 'sf_fields',
  LIVESTOCK: 'sf_livestock',
  INVENTORY: 'sf_inventory',
  TRANSACTIONS: 'sf_transactions',
  CATEGORIES: 'sf_categories',
  TASKS: 'sf_tasks',
  CURRENT_USER: 'sf_current_user',
};

// Initial Seed Data for LocalStorage Mode
const DEFAULT_FIELDS = [
  { id: 'f1', title: 'North Field', crop: 'Maize', area: '2.4 ha', workers: 3, status: 'healthy', moisture: 65, image: '/images/corn-field.png' },
  { id: 'f2', title: 'East Plot', crop: 'Cassava', area: '1.1 ha', workers: 1, status: 'attention', moisture: 38, image: '/images/corn-field.png' },
  { id: 'f3', title: 'South Orchard', crop: 'Plantain', area: '0.6 ha', workers: 2, status: 'healthy', moisture: 72, image: '/images/corn-field.png' },
  { id: 'f4', title: 'Demo Bed', crop: 'Vegetables', area: '0.2 ha', workers: 1, status: 'critical', moisture: 20, image: '/images/corn-field.png' },
];

const DEFAULT_LIVESTOCK = [
  { id: 'l1', name: 'Poultry Flock A', type: 'Poultry', count: 450, status: 'healthy', feed: 'Layer Feed (2 bags/day)', health_check: '2026-06-12' },
  { id: 'l2', name: 'Dairy Cows', type: 'Cattle', count: 12, status: 'healthy', feed: 'Cow Hay (5 bales/day)', health_check: '2026-06-15' },
  { id: 'l3', name: 'Goats Herd B', type: 'Goats', count: 28, status: 'attention', feed: 'Grazing + Mineral Blocks', health_check: '2026-06-10' },
  { id: 'l4', name: 'Porkers', type: 'Pigs', count: 15, status: 'healthy', feed: 'Swine Grower', health_check: '2026-06-14' },
];

const DEFAULT_INVENTORY = [
  { id: 'i1', name: 'Maize Seed', category: 'Seeds', qty: 120, unit: 'kg', lowStock: false },
  { id: 'i2', name: 'Layer Feed', category: 'Feed', qty: 8, unit: 'bags', lowStock: true },
  { id: 'i3', name: 'NPK Fertilizer', category: 'Fertilizer', qty: 24, unit: 'kg', lowStock: false },
  { id: 'i4', name: 'Oxytetracycline', category: 'Medicine', qty: 2, unit: 'bottles', lowStock: true },
  { id: 'i5', name: 'Cow Hay', category: 'Feed', qty: 60, unit: 'bales', lowStock: false },
];

const DEFAULT_CATEGORIES = [
  { id: 'c1', name: 'Crop Sales', type: 'income', icon: 'sprout' },
  { id: 'c2', name: 'Livestock Sales', type: 'income', icon: 'beef' },
  { id: 'c3', name: 'Other Income', type: 'income', icon: 'circle-dollar-sign' },
  { id: 'c4', name: 'Seeds & inputs', type: 'expense', icon: 'leaf' },
  { id: 'c5', name: 'Animal Feed', type: 'expense', icon: 'wheat' },
  { id: 'c6', name: 'Wages & Labor', type: 'expense', icon: 'users' },
  { id: 'c7', name: 'Equipment & Fuel', type: 'expense', icon: 'truck' },
];

const DEFAULT_TRANSACTIONS = [
  { id: 't1', type: 'income', amount: 350000, description: 'Maize harvest — bulk sale to Douala distributor', date: '2026-06-10', status: 'paid', payment_method: 'mobile_money', category_id: 'c1' },
  { id: 't2', type: 'expense', amount: 45000, description: 'NPK Fertilizer (50 kg bags x 3)', date: '2026-06-08', status: 'paid', payment_method: 'cash', category_id: 'c4' },
  { id: 't3', type: 'income', amount: 90000, description: 'Eggs collection — weekly market run', date: '2026-06-05', status: 'paid', payment_method: 'cash', category_id: 'c2' },
  { id: 't4', type: 'expense', amount: 75000, description: 'Seasonal labor — weeding crew (5 workers)', date: '2026-06-03', status: 'paid', payment_method: 'mobile_money', category_id: 'c6' },
  { id: 't5', type: 'income', amount: 120000, description: 'Vegetable sales — tomatoes & peppers', date: '2026-06-01', status: 'paid', payment_method: 'bank_transfer', category_id: 'c1' },
  { id: 't6', type: 'expense', amount: 30000, description: 'Diesel for irrigation pump', date: '2026-05-28', status: 'paid', payment_method: 'cash', category_id: 'c7' },
  { id: 't7', type: 'expense', amount: 60000, description: 'Veterinary checkup for poultry flock', date: '2026-05-25', status: 'pending', payment_method: 'bank_transfer', category_id: 'c5' },
];

const DEFAULT_TASKS = [
  { id: 'g1', title: 'Irrigate north field', assignee: 'Aminata', dueDate: '2026-06-16', status: 'pending' },
  { id: 'g2', title: 'Repair water pump', assignee: 'Kofi', dueDate: '2026-06-18', status: 'in_progress' },
  { id: 'g3', title: 'Harvest peppers — south plot', assignee: 'Adjoa', dueDate: '2026-06-20', status: 'pending' },
  { id: 'g4', title: 'Apply pesticide to maize', assignee: 'Moussa', dueDate: '2026-06-14', status: 'done' },
  { id: 'g5', title: 'Feed poultry — morning round', assignee: 'Fatou', dueDate: '2026-06-15', status: 'done' },
  { id: 'g6', title: 'Prune plantain suckers', assignee: 'Aminata', dueDate: '2026-06-22', status: 'pending' },
];

// Initialize Storage if empty
function initializeStorage() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(KEYS.FIELDS)) localStorage.setItem(KEYS.FIELDS, JSON.stringify(DEFAULT_FIELDS));
  if (!localStorage.getItem(KEYS.LIVESTOCK)) localStorage.setItem(KEYS.LIVESTOCK, JSON.stringify(DEFAULT_LIVESTOCK));
  if (!localStorage.getItem(KEYS.INVENTORY)) localStorage.setItem(KEYS.INVENTORY, JSON.stringify(DEFAULT_INVENTORY));
  if (!localStorage.getItem(KEYS.CATEGORIES)) localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  if (!localStorage.getItem(KEYS.TRANSACTIONS)) localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
  if (!localStorage.getItem(KEYS.TASKS)) localStorage.setItem(KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
}

// Ensure execution is client-safe
if (typeof window !== 'undefined') {
  initializeStorage();
}

function getLocalData<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function setLocalData<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Service Methods
export const dbService = {
  // === FIELDS & CROPS ===
  async getFields(): Promise<any[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('fields').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase Fields Read Error:', error);
    }
    return getLocalData(KEYS.FIELDS);
  },

  async createField(item: any): Promise<any> {
    const newItem = { ...item, id: item.id || crypto.randomUUID() };
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('fields')
        .insert([{ ...newItem, user_id: user?.id }])
        .select();
      if (!error && data) return data[0];
      console.error('Supabase Field Insert Error:', error);
    }
    const local = getLocalData<any>(KEYS.FIELDS);
    local.unshift(newItem);
    setLocalData(KEYS.FIELDS, local);
    return newItem;
  },

  async updateField(id: string, updates: any): Promise<any> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('fields')
        .update(updates)
        .eq('id', id)
        .select();
      if (!error && data) return data[0];
      console.error('Supabase Field Update Error:', error);
    }
    const local = getLocalData<any>(KEYS.FIELDS);
    const index = local.findIndex((x) => x.id === id);
    if (index !== -1) {
      local[index] = { ...local[index], ...updates };
      setLocalData(KEYS.FIELDS, local);
      return local[index];
    }
    return null;
  },

  async deleteField(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('fields').delete().eq('id', id);
      if (!error) return true;
      console.error('Supabase Field Delete Error:', error);
    }
    const local = getLocalData<any>(KEYS.FIELDS);
    const filtered = local.filter((x) => x.id !== id);
    setLocalData(KEYS.FIELDS, filtered);
    return true;
  },

  // === LIVESTOCK ===
  async getLivestock(): Promise<any[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('livestock').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase Livestock Read Error:', error);
    }
    return getLocalData(KEYS.LIVESTOCK);
  },

  async createLivestock(item: any): Promise<any> {
    const newItem = { ...item, id: item.id || crypto.randomUUID() };
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('livestock')
        .insert([{ ...newItem, user_id: user?.id }])
        .select();
      if (!error && data) return data[0];
      console.error('Supabase Livestock Insert Error:', error);
    }
    const local = getLocalData<any>(KEYS.LIVESTOCK);
    local.unshift(newItem);
    setLocalData(KEYS.LIVESTOCK, local);
    return newItem;
  },

  async updateLivestock(id: string, updates: any): Promise<any> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('livestock')
        .update(updates)
        .eq('id', id)
        .select();
      if (!error && data) return data[0];
      console.error('Supabase Livestock Update Error:', error);
    }
    const local = getLocalData<any>(KEYS.LIVESTOCK);
    const index = local.findIndex((x) => x.id === id);
    if (index !== -1) {
      local[index] = { ...local[index], ...updates };
      setLocalData(KEYS.LIVESTOCK, local);
      return local[index];
    }
    return null;
  },

  async deleteLivestock(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('livestock').delete().eq('id', id);
      if (!error) return true;
      console.error('Supabase Livestock Delete Error:', error);
    }
    const local = getLocalData<any>(KEYS.LIVESTOCK);
    const filtered = local.filter((x) => x.id !== id);
    setLocalData(KEYS.LIVESTOCK, filtered);
    return true;
  },

  // === INVENTORY ===
  async getInventory(): Promise<any[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('inventory').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase Inventory Read Error:', error);
    }
    return getLocalData(KEYS.INVENTORY);
  },

  async createInventoryItem(item: any): Promise<any> {
    const newItem = { ...item, id: item.id || crypto.randomUUID() };
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('inventory')
        .insert([{ ...newItem, user_id: user?.id }])
        .select();
      if (!error && data) return data[0];
      console.error('Supabase Inventory Insert Error:', error);
    }
    const local = getLocalData<any>(KEYS.INVENTORY);
    local.unshift(newItem);
    setLocalData(KEYS.INVENTORY, local);
    return newItem;
  },

  async updateInventoryItem(id: string, updates: any): Promise<any> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', id)
        .select();
      if (!error && data) return data[0];
      console.error('Supabase Inventory Update Error:', error);
    }
    const local = getLocalData<any>(KEYS.INVENTORY);
    const index = local.findIndex((x) => x.id === id);
    if (index !== -1) {
      local[index] = { ...local[index], ...updates };
      setLocalData(KEYS.INVENTORY, local);
      return local[index];
    }
    return null;
  },

  async deleteInventoryItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('inventory').delete().eq('id', id);
      if (!error) return true;
      console.error('Supabase Inventory Delete Error:', error);
    }
    const local = getLocalData<any>(KEYS.INVENTORY);
    const filtered = local.filter((x) => x.id !== id);
    setLocalData(KEYS.INVENTORY, filtered);
    return true;
  },

  // === TRANSACTIONS (FINANCE) ===
  async getTransactions(): Promise<any[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, category:financial_categories(*)')
        .order('date', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase Transactions Read Error:', error);
    }
    // Locally populate categories matching category_id
    const txs = getLocalData<any>(KEYS.TRANSACTIONS);
    const cats = getLocalData<any>(KEYS.CATEGORIES);
    return txs.map((tx) => ({
      ...tx,
      category: cats.find((c) => c.id === tx.category_id) || { name: 'Uncategorized', icon: 'circle-dollar-sign' },
    }));
  },

  async createTransaction(tx: any): Promise<any> {
    const newTx = { ...tx, id: tx.id || crypto.randomUUID() };
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...newTx, user_id: user?.id }])
        .select();
      if (!error && data) return data[0];
      console.error('Supabase Transaction Insert Error:', error);
    }
    const local = getLocalData<any>(KEYS.TRANSACTIONS);
    local.unshift(newTx);
    setLocalData(KEYS.TRANSACTIONS, local);
    return newTx;
  },

  async updateTransaction(id: string, updates: any): Promise<any> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select();
      if (!error && data) return data[0];
      console.error('Supabase Transaction Update Error:', error);
    }
    const local = getLocalData<any>(KEYS.TRANSACTIONS);
    const index = local.findIndex((x) => x.id === id);
    if (index !== -1) {
      local[index] = { ...local[index], ...updates };
      setLocalData(KEYS.TRANSACTIONS, local);
      return local[index];
    }
    return null;
  },

  async deleteTransaction(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (!error) return true;
      console.error('Supabase Transaction Delete Error:', error);
    }
    const local = getLocalData<any>(KEYS.TRANSACTIONS);
    const filtered = local.filter((x) => x.id !== id);
    setLocalData(KEYS.TRANSACTIONS, filtered);
    return true;
  },

  async getCategories(): Promise<any[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('financial_categories').select('*');
      if (!error && data) return data;
      console.error('Supabase Categories Read Error:', error);
    }
    return getLocalData(KEYS.CATEGORIES);
  },

  // === TASKS ===
  async getTasks(): Promise<any[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('tasks').select('*').order('due_date', { ascending: true });
      if (!error && data) return data;
      console.error('Supabase Tasks Read Error:', error);
    }
    return getLocalData(KEYS.TASKS);
  },

  async createTask(task: any): Promise<any> {
    const newTask = { ...task, id: task.id || crypto.randomUUID() };
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...newTask, user_id: user?.id }])
        .select();
      if (!error && data) return data[0];
      console.error('Supabase Task Insert Error:', error);
    }
    const local = getLocalData<any>(KEYS.TASKS);
    local.unshift(newTask);
    setLocalData(KEYS.TASKS, local);
    return newTask;
  },

  async updateTask(id: string, updates: any): Promise<any> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select();
      if (!error && data) return data[0];
      console.error('Supabase Task Update Error:', error);
    }
    const local = getLocalData<any>(KEYS.TASKS);
    const index = local.findIndex((x) => x.id === id);
    if (index !== -1) {
      local[index] = { ...local[index], ...updates };
      setLocalData(KEYS.TASKS, local);
      return local[index];
    }
    return null;
  },

  async deleteTask(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (!error) return true;
      console.error('Supabase Task Delete Error:', error);
    }
    const local = getLocalData<any>(KEYS.TASKS);
    const filtered = local.filter((x) => x.id !== id);
    setLocalData(KEYS.TASKS, filtered);
    return true;
  },
};
