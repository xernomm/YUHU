/**
 * API Service Client for Nova E-commerce & MLM System
 * 
 * This file provides type-safe methods and TypeScript interfaces to communicate with 
 * the Next.js backend API routes.
 */

// ==========================================
// 1. TYPE DEFINITIONS & INTERFACES
// ==========================================

export interface User {
  id: string;
  username: string;
  nama: string;
  email: string;
  no_telp: string;
  role: 'member' | 'affiliator' | 'reseller' | 'mitra_prioritas';
  referral_code: string;
  sponsor_id: string | null;
  profile_picture?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserDetail {
  id: number;
  user_id: string;
  bank?: string | null;
  nomor_rekening?: string | null;
  pemilik_rekening?: string | null;
  nomor_ktp?: string | null;
  nomor_npwp?: string | null;
  provinsi?: string | null;
  kabupaten_kota?: string | null;
  kecamatan?: string | null;
  desa_kelurahan?: string | null;
  alamat_lengkap?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Auth Request/Response Interfaces
export interface RegisterRequest {
  username: string;
  password?: string;
  nama: string;
  email: string;
  no_telp: string;
  referral_code?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string; // can also be username
  password?: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

// User Profile Request/Response Interfaces
// Profile updates use multipart/form-data, but we type the input options
export interface UpdateProfileRequest {
  nama?: string;
  email?: string;
  no_telp?: string;
  bank?: string;
  nomor_rekening?: string;
  pemilik_rekening?: string;
  nomor_ktp?: string;
  nomor_npwp?: string;
  provinsi?: string;
  kabupaten_kota?: string;
  kecamatan?: string;
  desa_kelurahan?: string;
  alamat_lengkap?: string;
  profile_picture?: File | Blob; // For file upload
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
  userDetail: UserDetail;
}

export interface ValidateBankRequest {
  bank_code: string;
  account_number: string;
}

export interface ValidateBankResponse {
  message: string;
  account_holder_name: string | null;
  bank_code: string;
  account_number: string;
  status: string;
}

export interface SearchUsersQuery {
  role?: 'member' | 'affiliator' | 'reseller' | 'mitra_prioritas';
  search?: string;
  page?: number;
  limit?: number;
}

export interface SearchUsersResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  users: (User & { userDetail: UserDetail | null })[];
}

export interface GetUserDetailsResponse extends User {
  userDetail: UserDetail | null;
  sponsor: Pick<User, 'id' | 'username' | 'nama' | 'email' | 'role' | 'referral_code'> | null;
  sponsoredUsers: User[];
}

// Order & MLM Request/Response Interfaces
export interface OrderItemInput {
  product_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: OrderItemInput[];
  ongkos_kirim: number;
  is_external_marketplace?: boolean;
  marketplace_source?: string | null;
}

export interface Order {
  id: number;
  user_id: string;
  order_number: string;
  status: 'pending' | 'paid' | 'cancelled';
  subtotal: number | string;
  ongkos_kirim: number | string;
  is_discount_applied: boolean;
  jenis_promo?: string | null;
  besar_discount: number | string;
  total_amount: number | string;
  is_external_marketplace: boolean;
  marketplace_source?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  harga_satuan: number | string;
  product?: {
    id: number;
    sku_product: string;
    nama_product: string;
    jenis_product: string;
    main_image?: string | null;
  };
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
  };
}

export interface PayOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
    commission?: {
      id: number;
      user_id: string;
      order_id: number;
      amount: number | string;
      status: 'pending' | 'paid';
      createdAt: string;
      updatedAt: string;
    } | null;
  };
}

export interface OrderHistoryResponse {
  success: boolean;
  message: string;
  data: Order[];
}

// Commission Request/Response Interfaces
export interface CommissionRecord {
  id: number;
  user_id: string;
  order_id: number;
  amount: string | number;
  status: 'pending' | 'paid';
  createdAt: string;
  updatedAt: string;
  order?: {
    id: number;
    order_number: string;
    total_amount: string | number;
    status: string;
    created_at: string;
  };
}

export interface GetCommissionsResponse {
  success: boolean;
  message: string;
  data: {
    totalPending: number;
    totalPaid: number;
    totalEarned: number;
    commissions: CommissionRecord[];
  };
}

// Wallet & Withdrawal Request/Response Interfaces
export interface WithdrawRequest {
  amount: number;
  bank: string;
  nomor_rekening: string;
  pemilik_rekening: string;
}

export interface WithdrawalRequestRecord {
  id: number;
  user_id: string;
  amount: string | number;
  bank: string;
  nomor_rekening: string;
  pemilik_rekening: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawResponse {
  success: boolean;
  message: string;
  data: WithdrawalRequestRecord;
}

export interface WithdrawHistoryResponse {
  success: boolean;
  message: string;
  data: WithdrawalRequestRecord[];
}

export interface ApproveWithdrawResponse {
  success: boolean;
  message: string;
  data: WithdrawalRequestRecord;
}

export interface RejectWithdrawResponse {
  success: boolean;
  message: string;
  data: WithdrawalRequestRecord;
}

export interface CleanupExpiredOrdersResponse {
  success: boolean;
  message: string;
  data: {
    cancelledCount: number;
  };
}

// ==========================================
// 2. CLIENT IMPLEMENTATION WITH FETCH
// ==========================================

class ApiService {
  private static baseUrl = ''; // Empty string for relative path (default in same-origin Next.js)

  /**
   * Helper to configure the base URL if needed (e.g. for testing or external frontend)
   */
  public static setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  /**
   * Generic request wrapper to handle error handling and headers.
   */
  private static async request<T>(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    
    // Automatically determine headers
    const headers = new Headers(options.headers || {});
    
    let requestBody: any = undefined;
    
    if (body) {
      if (body instanceof FormData) {
        // Fetch will automatically set content-type and boundary for FormData
        requestBody = body;
      } else {
        headers.set('Content-Type', 'application/json');
        requestBody = JSON.stringify(body);
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: requestBody,
      credentials: 'include', // Ensures cookies are sent/received
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.error || data.message || 'API request failed',
        details: data,
      };
    }

    return data as T;
  }

  // ------------------------------------------
  // AUTHENTICATION APIs
  // ------------------------------------------

  public static async register(payload: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/api/auth/register', 'POST', payload);
  }

  public static async login(payload: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/auth/login', 'POST', payload);
  }

  public static async forgotPassword(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return this.request<ForgotPasswordResponse>('/api/auth/forgot-password', 'POST', payload);
  }

  public static async logout(): Promise<LogoutResponse> {
    return this.request<LogoutResponse>('/api/auth/logout', 'POST');
  }

  // ------------------------------------------
  // USER PROFILE APIs
  // ------------------------------------------

  /**
   * Updates user profile details, supporting text fields and file uploads.
   * Can accept raw UpdateProfileRequest object or a built FormData.
   */
  public static async updateProfile(payload: UpdateProfileRequest | FormData): Promise<UpdateProfileResponse> {
    let body: FormData;
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = new FormData();
      Object.entries(payload).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          body.append(key, val instanceof Blob ? val : String(val));
        }
      });
    }
    return this.request<UpdateProfileResponse>('/api/user/profile', 'PUT', body);
  }

  public static async validateBank(payload: ValidateBankRequest): Promise<ValidateBankResponse> {
    return this.request<ValidateBankResponse>('/api/user/validate-bank', 'POST', payload);
  }

  public static async searchUsers(query: SearchUsersQuery = {}): Promise<SearchUsersResponse> {
    const params = new URLSearchParams();
    if (query.role) params.append('role', query.role);
    if (query.search) params.append('search', query.search);
    if (query.page) params.append('page', String(query.page));
    if (query.limit) params.append('limit', String(query.limit));

    const queryString = params.toString();
    const path = `/api/user${queryString ? `?${queryString}` : ''}`;
    return this.request<SearchUsersResponse>(path, 'GET');
  }

  public static async getUserDetails(userId: string): Promise<GetUserDetailsResponse> {
    return this.request<GetUserDetailsResponse>(`/api/user/${userId}`, 'GET');
  }

  // ------------------------------------------
  // ORDER & MLM APIs
  // ------------------------------------------

  public static async createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.request<CreateOrderResponse>('/api/orders', 'POST', payload);
  }

  public static async payOrder(orderId: number): Promise<PayOrderResponse> {
    return this.request<PayOrderResponse>(`/api/orders/${orderId}/pay`, 'POST');
  }

  public static async getOrderHistory(): Promise<OrderHistoryResponse> {
    return this.request<OrderHistoryResponse>('/api/orders/history', 'GET');
  }

  // ------------------------------------------
  // COMMISSION APIs
  // ------------------------------------------

  public static async getCommissions(): Promise<GetCommissionsResponse> {
    return this.request<GetCommissionsResponse>('/api/commissions', 'GET');
  }

  // ------------------------------------------
  // WALLET & WITHDRAWAL APIs
  // ------------------------------------------

  public static async requestWithdrawal(payload: WithdrawRequest): Promise<WithdrawResponse> {
    return this.request<WithdrawResponse>('/api/user/withdraw', 'POST', payload);
  }

  public static async getWithdrawalHistory(): Promise<WithdrawHistoryResponse> {
    return this.request<WithdrawHistoryResponse>('/api/user/withdraw', 'GET');
  }

  // ------------------------------------------
  // ADMIN APIs
  // ------------------------------------------

  public static async approveWithdrawal(requestId: number): Promise<ApproveWithdrawResponse> {
    return this.request<ApproveWithdrawResponse>(`/api/admin/withdraw/${requestId}/approve`, 'POST');
  }

  public static async rejectWithdrawal(requestId: number): Promise<RejectWithdrawResponse> {
    return this.request<RejectWithdrawResponse>(`/api/admin/withdraw/${requestId}/reject`, 'POST');
  }

  public static async cleanupExpiredOrders(): Promise<CleanupExpiredOrdersResponse> {
    return this.request<CleanupExpiredOrdersResponse>('/api/orders/cleanup-expired', 'POST');
  }
}

export default ApiService;
