# API Documentation - Nova E-commerce & MLM System

This document provides details for the API routes implemented inside the Next.js App Router workspace, including payloads, headers, query parameters, and example responses.

---

## Base URL
All API paths are relative to the server host:
`http://localhost:3000`

---

## Authentication Endpoints

### 1. Register Account
* **Route:** `POST /api/auth/register`
* **Content-Type:** `application/json`
* **Request Body:**
```json
{
  "username": "usera",
  "password": "password123",
  "nama": "User Sponsor A",
  "email": "usera@example.com",
  "no_telp": "08123456789",
  "referral_code": "REF_OPTIONAL_SPONSOR_CODE"
}
```
* **Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "b252d149-0d33-4c26-8cca-bd60d64b7346",
    "username": "usera",
    "nama": "User Sponsor A",
    "email": "usera@example.com",
    "no_telp": "08123456789",
    "role": "member",
    "referral_code": "REFSHDA0LLO",
    "sponsor_id": null
  },
  "token": "JWT_TOKEN_STRING"
}
```
* **Sets Cookie:** `token` (HTTP-Only, Secure, SameSite=Strict, MaxAge=1 day).

---

### 2. Login
* **Route:** `POST /api/auth/login`
* **Content-Type:** `application/json`
* **Request Body:**
```json
{
  "email": "usera@example.com", // Or "username"
  "password": "password123"
}
```
* **Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "b252d149-0d33-4c26-8cca-bd60d64b7346",
    "username": "usera",
    "nama": "User Sponsor A",
    "email": "usera@example.com",
    "no_telp": "08123456789",
    "role": "member",
    "referral_code": "REFSHDA0LLO",
    "sponsor_id": null
  },
  "token": "JWT_TOKEN_STRING"
}
```
* **Sets Cookie:** `token` (HTTP-Only, Secure, SameSite=Strict, MaxAge=1 day).

---

### 3. Forgot Password
* **Route:** `POST /api/auth/forgot-password`
* **Content-Type:** `application/json`
* **Request Body:**
```json
{
  "email": "usera@example.com"
}
```
* **Response (200 OK):**
```json
{
  "message": "If the email exists in our system, a reset link/OTP has been sent."
}
```

---

### 4. Logout
* **Route:** `POST /api/auth/logout`
* **Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```
* **Clears Cookie:** Deletes the `token` cookie.

---

## Profile & Verification (Protected)
*All requests require the `token` cookie to be present.*

### 5. Update Profile
* **Route:** `PUT /api/user/profile`
* **Content-Type:** `multipart/form-data`
* **Request Fields (Form Data):**
  - `nama` (String, Optional)
  - `email` (String, Optional)
  - `no_telp` (String, Optional)
  - `bank` (String, Optional)
  - `nomor_rekening` (String, Optional)
  - `pemilik_rekening` (String, Optional)
  - `nomor_ktp` (String, Optional)
  - `nomor_npwp` (String, Optional)
  - `provinsi` (String, Optional)
  - `kabupaten_kota` (String, Optional)
  - `kecamatan` (String, Optional)
  - `desa_kelurahan` (String, Optional)
  - `alamat_lengkap` (String, Optional)
  - `profile_picture` (File/Blob, Optional)
* **Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "b252d149-0d33-4c26-8cca-bd60d64b7346",
    "username": "usera",
    "nama": "Updated Name",
    "email": "usera@example.com",
    "no_telp": "08123456789",
    "role": "member",
    "profile_picture": "/uploads/profile_b252d149-0d33-4c26-8cca-bd60d64b7346_1781161959.png"
  },
  "userDetail": {
    "id": 1,
    "user_id": "b252d149-0d33-4c26-8cca-bd60d64b7346",
    "bank": "BCA",
    "nomor_rekening": "1234567890",
    "pemilik_rekening": "John Doe",
    "nomor_ktp": "3201234567890001",
    "nomor_npwp": "012345678901000",
    "provinsi": "Jawa Barat",
    "kabupaten_kota": "Bogor",
    "kecamatan": "Cibinong",
    "desa_kelurahan": "Pakansari",
    "alamat_lengkap": "Jl. Tegar Beriman No. 1",
    "updatedAt": "2026-06-11T07:12:39.000Z",
    "createdAt": "2026-06-11T07:12:39.000Z"
  }
}
```

---

### 6. Validate Bank (Xendit Integration)
* **Route:** `POST /api/user/validate-bank`
* **Content-Type:** `application/json`
* **Request Body:**
```json
{
  "bank_code": "bca",
  "account_number": "1234567890"
}
```
* **Response (200 OK):**
```json
{
  "message": "Bank account validated successfully",
  "account_holder_name": "JOHN DOE",
  "bank_code": "BCA",
  "account_number": "1234567890",
  "status": "SUCCESS"
}
```

---

## User Queries (Protected)

### 7. Search Users
* **Route:** `GET /api/user`
* **Query Parameters:**
  - `role` (Optional: `'member'`, `'affiliator'`, `'reseller'`, `'mitra_prioritas'`)
  - `search` (Optional: text match against `nama`, `username`, `email`, or `no_telp`)
  - `page` (Optional: default `1`)
  - `limit` (Optional: default `10`)
* **Response (200 OK):**
```json
{
  "totalItems": 1,
  "totalPages": 1,
  "currentPage": 1,
  "limit": 10,
  "users": [
    {
      "id": "b252d149-0d33-4c26-8cca-bd60d64b7346",
      "username": "usera",
      "nama": "User Sponsor A",
      "email": "usera@example.com",
      "no_telp": "08123456789",
      "role": "member",
      "referral_code": "REFSHDA0LLO",
      "sponsor_id": null,
      "profile_picture": null,
      "userDetail": null,
      "createdAt": "2026-06-11T07:12:39.000Z",
      "updatedAt": "2026-06-11T07:12:39.000Z"
    }
  ]
}
```

---

### 8. Get User Details
* **Route:** `GET /api/user/[id]`
* **Response (200 OK):**
```json
{
  "id": "793ba83d-838a-4266-aeb9-d19e5096a208",
  "username": "userb",
  "nama": "User Downline B",
  "email": "userb@example.com",
  "no_telp": "08129876543",
  "role": "reseller",
  "referral_code": "REFA56U9RN3",
  "sponsor_id": "b252d149-0d33-4c26-8cca-bd60d64b7346",
  "profile_picture": null,
  "createdAt": "2026-06-11T07:12:39.000Z",
  "updatedAt": "2026-06-11T07:12:39.000Z",
  "userDetail": null,
  "sponsor": {
    "id": "b252d149-0d33-4c26-8cca-bd60d64b7346",
    "username": "usera",
    "nama": "User Sponsor A",
    "email": "usera@example.com",
    "role": "member",
    "referral_code": "REFSHDA0LLO"
  },
  "sponsoredUsers": []
}
```

---

## Order & MLM Commission (Protected)

### 9. Create Order (Checkout)
* **Route:** `POST /api/orders`
* **Content-Type:** `application/json`
* **Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "ongkos_kirim": 15000,
  "is_external_marketplace": false,
  "marketplace_source": null
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 1,
      "user_id": "793ba83d-838a-4266-aeb9-d19e5096a208",
      "order_number": "ORD-1781161959851-9566",
      "status": "pending",
      "subtotal": 200000,
      "ongkos_kirim": 15000,
      "is_discount_applied": true,
      "jenis_promo": "Role Discount (reseller)",
      "besar_discount": 30000,
      "total_amount": 185000,
      "is_external_marketplace": false,
      "marketplace_source": null,
      "updatedAt": "2026-06-11T07:12:39.852Z",
      "createdAt": "2026-06-11T07:12:39.852Z"
    }
  }
}
```

*Note: Dynamically calculates role-based discount (member/affiliator = 0%, reseller = 15%, mitra_prioritas = 30%) and deducts stock inside a database transaction.*

---

### 10. Pay Order
* **Route:** `POST /api/orders/[order_id]/pay`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment completed successfully.",
  "data": {
    "order": {
      "id": 1,
      "user_id": "793ba83d-838a-4266-aeb9-d19e5096a208",
      "order_number": "ORD-1781161959851-9566",
      "status": "paid",
      "subtotal": "200000.00",
      "ongkos_kirim": "15000.00",
      "is_discount_applied": true,
      "jenis_promo": "Role Discount (reseller)",
      "besar_discount": "30000.00",
      "total_amount": "185000.00",
      "is_external_marketplace": false,
      "marketplace_source": null,
      "createdAt": "2026-06-11T07:12:39.000Z",
      "updatedAt": "2026-06-11T07:12:41.232Z"
    },
    "commission": {
      "id": 1,
      "user_id": "b252d149-0d33-4c26-8cca-bd60d64b7346",
      "order_id": 1,
      "amount": 9250,
      "status": "pending",
      "updatedAt": "2026-06-11T07:12:41.239Z",
      "createdAt": "2026-06-11T07:12:41.239Z"
    }
  }
}
```

*Note: Changes status to `'paid'` and calculates/distributes 5% upline commission to the buyer's sponsor, storing it in `CommissionHistory` inside a database transaction.*

---

### 11. Retrieve Order History
* **Route:** `GET /api/orders/history`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Order history retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": "793ba83d-838a-4266-aeb9-d19e5096a208",
      "order_number": "ORD-1781161959851-9566",
      "status": "paid",
      "subtotal": "200000.00",
      "ongkos_kirim": "15000.00",
      "is_discount_applied": true,
      "jenis_promo": "Role Discount (reseller)",
      "besar_discount": "30000.00",
      "total_amount": "185000.00",
      "is_external_marketplace": false,
      "marketplace_source": null,
      "createdAt": "2026-06-11T07:12:39.000Z",
      "updatedAt": "2026-06-11T07:12:41.000Z",
      "items": [
        {
          "id": 1,
          "order_id": 1,
          "product_id": 1,
          "quantity": 2,
          "harga_satuan": "100000.00",
          "product": {
            "id": 1,
            "sku_product": "PROD-001",
            "nama_product": "Nova Premium Coffee",
            "jenis_product": "Minuman",
            "main_image": "/images/coffee.png"
          }
        }
      ]
    }
  ]
}
```

---

### 12. Get Commissions (MLM Earnings)
* **Route:** `GET /api/commissions`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Commission data retrieved successfully.",
  "data": {
    "totalPending": 9250,
    "totalPaid": 0,
    "totalEarned": 9250,
    "commissions": [
      {
        "id": 1,
        "user_id": "b252d149-0d33-4c26-8cca-bd60d64b7346",
        "order_id": 1,
        "amount": "9250.00",
        "status": "pending",
        "createdAt": "2026-06-11T07:12:41.000Z",
        "updatedAt": "2026-06-11T07:12:41.000Z",
        "order": {
          "id": 1,
          "order_number": "ORD-1781161959851-9566",
          "total_amount": "185000.00",
          "status": "paid",
          "created_at": "2026-06-11T07:12:39.000Z"
        }
      }
    ]
  }
}
```

---

## Wallets & Withdrawals (Protected)

### 13. Create Withdrawal Request
* **Route:** `POST /api/user/withdraw`
* **Content-Type:** `application/json`
* **Request Body:**
```json
{
  "amount": 5000,
  "bank": "BCA",
  "nomor_rekening": "7770001112",
  "pemilik_rekening": "User B"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Withdrawal request submitted successfully.",
  "data": {
    "id": 1,
    "user_id": "98973bb1-7d15-4a46-9163-7cc2477f8a75",
    "amount": 5000,
    "bank": "BCA",
    "nomor_rekening": "7770001112",
    "pemilik_rekening": "User B",
    "status": "pending"
  }
}
```
*Note: This checks if the user has sufficient wallet balance, deducts the amount from `balance`, adds it to `locked_balance`, and creates a pending withdrawal request.*

---

### 14. Get Withdrawal History
* **Route:** `GET /api/user/withdraw`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Withdrawal history retrieved successfully.",
  "data": [
    {
      "id": 1,
      "user_id": "98973bb1-7d15-4a46-9163-7cc2477f8a75",
      "amount": "5000.00",
      "bank": "BCA",
      "nomor_rekening": "7770001112",
      "pemilik_rekening": "User B",
      "status": "pending",
      "createdAt": "2026-06-11T07:26:35.000Z",
      "updatedAt": "2026-06-11T07:26:35.000Z"
    }
  ]
}
```

---

## Admin Administration (Protected - Admin Only)

### 15. Approve Withdrawal Request
* **Route:** `POST /api/admin/withdraw/[id]/approve`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Withdrawal request approved successfully.",
  "data": {
    "id": 1,
    "user_id": "98973bb1-7d15-4a46-9163-7cc2477f8a75",
    "amount": "5000.00",
    "bank": "BCA",
    "nomor_rekening": "7770001112",
    "pemilik_rekening": "User B",
    "status": "approved"
  }
}
```
*Note: Deducts the amount from the user's `locked_balance` and records a ledger debit entry in the database.*

---

### 16. Reject Withdrawal Request
* **Route:** `POST /api/admin/withdraw/[id]/reject`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Withdrawal request rejected and funds refunded to wallet successfully.",
  "data": {
    "id": 1,
    "user_id": "98973bb1-7d15-4a46-9163-7cc2477f8a75",
    "amount": "5000.00",
    "bank": "BCA",
    "nomor_rekening": "7770001112",
    "pemilik_rekening": "User B",
    "status": "rejected"
  }
}
```
*Note: Refunds the amount from `locked_balance` back to the available `balance` of the user's wallet.*

---

### 17. Cleanup Expired Pending Orders
* **Route:** `POST /api/orders/cleanup-expired`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully checked expired orders. Cancelled: 1.",
  "data": {
    "cancelledCount": 1
  }
}
```
*Note: Looks up pending orders older than 2 hours, updates their status to `'cancelled'`, and restores their item quantities back to the product inventory stock.*

