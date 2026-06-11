import { sequelize, Product, User, Wallet, WalletLedger, WithdrawalRequest } from '../../lib/models/index.js';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('--- Starting Advanced Integration Tests ---');
  
  try {
    // 1. Reset database
    await sequelize.sync({ force: true });
    console.log('Database synced (force: true) successfully.');

    // 2. Seed test product
    const product = await Product.create({
      sku_product: 'PROD-001',
      nama_product: 'Nova Premium Coffee',
      jenis_product: 'Minuman',
      harga: 100000.00,
      stok: 50,
      main_image: '/images/coffee.png'
    });
    console.log('Seeded test product:', product.nama_product);

    // 3. Register Sponsor Level 2 (User A)
    console.log('\nRegistering User A (Upline Level 2)...');
    const regResA = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'usera',
        password: 'password123',
        nama: 'User A Upline',
        email: 'usera@example.com',
        no_telp: '08123456789'
      })
    });
    const regDataA = await regResA.json();
    const referralCodeA = regDataA.user.referral_code;
    const userIdA = regDataA.user.id;
    console.log('User A registered. Path:', regDataA.user.path);

    // 4. Register Sponsor Level 1 (User B, sponsored by User A)
    console.log('\nRegistering User B (Upline Level 1, sponsored by User A)...');
    const regResB = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'userb',
        password: 'password123',
        nama: 'User B Sponsor',
        email: 'userb@example.com',
        no_telp: '08129876543',
        referral_code: referralCodeA
      })
    });
    const regDataB = await regResB.json();
    const referralCodeB = regDataB.user.referral_code;
    const userIdB = regDataB.user.id;
    console.log('User B registered. Path:', regDataB.user.path);

    // 5. Register Buyer (User C, sponsored by User B)
    console.log('\nRegistering User C (Buyer, sponsored by User B)...');
    const regResC = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'userc',
        password: 'password123',
        nama: 'User C Buyer',
        email: 'userc@example.com',
        no_telp: '08121112223',
        referral_code: referralCodeB
      })
    });
    const regDataC = await regResC.json();
    const userIdC = regDataC.user.id;
    console.log('User C registered. Path:', regDataC.user.path);

    // 6. Login User C (Buyer)
    const loginResC = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'userc@example.com',
        password: 'password123'
      })
    });
    const cookieC = loginResC.headers.get('set-cookie').split(';')[0];

    // 7. User C checks out an order
    // Subtotal: 200,000 IDR (2 items), shipping: 15,000 IDR. Total: 215,000 IDR (Member has 0% discount)
    console.log('\nCreating order for User C (Buyer)...');
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieC
      },
      body: JSON.stringify({
        items: [{ product_id: product.id, quantity: 2 }],
        ongkos_kirim: 15000,
        is_external_marketplace: false
      })
    });
    const orderData = await orderRes.json();
    const orderId = orderData.data.order.id;
    const orderTotal = Number(orderData.data.order.total_amount);
    console.log(`Order created. Total Amount: ${orderTotal}`);

    // 8. User C pays for order. This triggers MLM commissions:
    // Upline Level 1 (User B) gets 5% of 215,000 = 10,750 IDR
    // Upline Level 2 (User A) gets 3% of 215,000 = 6,450 IDR
    console.log('\nPaying for order (Triggering Multi-Level Commissions)...');
    const payRes = await fetch(`${BASE_URL}/api/orders/${orderId}/pay`, {
      method: 'POST',
      headers: { 'Cookie': cookieC }
    });
    const payData = await payRes.json();
    console.log('Payment response message:', payData.message);

    // 9. Verify Wallet Balance & Ledgers in DB
    console.log('\nVerifying Commission distributions in Database:');
    
    const walletB = await Wallet.findOne({ where: { user_id: userIdB } });
    console.log(`User B (Level 1 Upline) Wallet Balance: ${walletB.balance} (Expected: 10750.00)`);

    const walletA = await Wallet.findOne({ where: { user_id: userIdA } });
    console.log(`User A (Level 2 Upline) Wallet Balance: ${walletA.balance} (Expected: 6450.00)`);

    const ledgersB = await WalletLedger.findAll({ where: { wallet_id: walletB.id } });
    console.log(`User B Ledger Entries count: ${ledgersB.length}. Description: "${ledgersB[0]?.description}"`);

    // 10. Login User B to submit a Withdrawal Request via API
    console.log('\nLogging in User B...');
    const loginResB = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'userb@example.com',
        password: 'password123'
      })
    });
    const cookieB = loginResB.headers.get('set-cookie').split(';')[0];

    console.log('\nSubmitting Withdrawal Request for User B (Requesting 5,000 IDR)...');
    const withdrawRes = await fetch(`${BASE_URL}/api/user/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieB
      },
      body: JSON.stringify({
        amount: 5000,
        bank: 'BCA',
        nomor_rekening: '7770001112',
        pemilik_rekening: 'User B'
      })
    });
    const withdrawData = await withdrawRes.json();
    const withdrawRequestId = withdrawData.data.id;
    console.log('Withdrawal request status:', withdrawRes.status);
    console.log('Withdrawal request data:', JSON.stringify(withdrawData, null, 2));

    // Verify balances after request (balance should drop from 10,750 to 5,750; locked balance should be 5,000)
    const walletBPostReq = await Wallet.findOne({ where: { user_id: userIdB } });
    console.log(`User B Wallet after request: Balance = ${walletBPostReq.balance}, Locked = ${walletBPostReq.locked_balance}`);

    // 11. Promote User A to admin role directly in DB so they can approve/reject withdrawals
    await User.update({ role: 'admin' }, { where: { id: userIdA } });
    console.log('\nPromoted User A to Admin role in Database.');

    // Login User A (Admin)
    const loginResA = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'usera@example.com',
        password: 'password123'
      })
    });
    const cookieA = loginResA.headers.get('set-cookie').split(';')[0];

    // 12. Test Approve Withdrawal via Admin API
    console.log(`\nTesting POST /api/admin/withdraw/[id]/approve (Admin User A approving request for User B)...`);
    const approveRes = await fetch(`${BASE_URL}/api/admin/withdraw/${withdrawRequestId}/approve`, {
      method: 'POST',
      headers: { 'Cookie': cookieA }
    });
    const approveData = await approveRes.json();
    console.log('Approve response status:', approveRes.status);
    console.log('Approve response data:', JSON.stringify(approveData, null, 2));

    // Verify balances after approval (locked balance should drop to 0, total ledger should show a debit)
    const walletBPostApprove = await Wallet.findOne({ where: { user_id: userIdB } });
    console.log(`User B Wallet after approval: Balance = ${walletBPostApprove.balance}, Locked = ${walletBPostApprove.locked_balance}`);

    const ledgersBPostApprove = await WalletLedger.findAll({ where: { wallet_id: walletB.id } });
    console.log(`User B total ledger entries count: ${ledgersBPostApprove.length}`);
    console.log(`User B latest ledger entry type: ${ledgersBPostApprove[1]?.type}, amount: ${ledgersBPostApprove[1]?.amount}`);

    // 13. Test Expired Cleanup Endpoint
    console.log('\nTesting POST /api/orders/cleanup-expired...');
    const cleanupRes = await fetch(`${BASE_URL}/api/orders/cleanup-expired`, {
      method: 'POST',
      headers: { 'Cookie': cookieA }
    });
    const cleanupData = await cleanupRes.json();
    console.log('Cleanup response:', JSON.stringify(cleanupData, null, 2));

    console.log('\n--- ADVANCED INTEGRATION TESTS COMPLETED SUCCESSFULLY! ---');
    process.exit(0);
  } catch (error) {
    console.error('\n--- ADVANCED INTEGRATION TESTS FAILED! ---', error);
    process.exit(1);
  }
}

setTimeout(runTests, 5000);
