// =====================================================
// GambitAI - Update Database to 2025/2026
// =====================================================
// Instruksi:
// 1. Buka https://5kzrrwm0sj8a.space.minimax.io/login
// 2. Login ke dashboard
// 3. Buka Browser DevTools (F12)
// 4. Paste seluruh script ini di Console tab
// 5. Tekan Enter dan tunggu sampai selesai
// =====================================================

(async function() {
  console.log('='.repeat(60));
  console.log('GambitAI - Update Database to 2025/2026');
  console.log('='.repeat(60));
  
  const SUPABASE_URL = 'https://bpbtgkunrdzcoyfdhskh.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYnRna3VucmR6Y295ZmRoc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjAzNzUsImV4cCI6MjA3ODQ5NjM3NX0.ZAtjUoDnIWUOs6Os1NUGKIRUQVOuXDlaCJ4HwQqZu50';

  console.log('\n[1/2] Memanggil edge function untuk update data...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/load-sample-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    const result = await response.json();
    
    console.log('✓ Edge function berhasil dipanggil!');
    console.log('✓ Data yang diinsert:', result.data.inserted, 'opportunities');
    console.log('\n[2/2] Memverifikasi data baru...');
    
    // Verify data
    const verifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/arbitrage_opportunities?status=eq.active&select=id,event_name,category,detected_at&limit=10`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });
    
    const data = await verifyResponse.json();
    
    console.log('\n✓ Data berhasil diverifikasi!');
    console.log('Sample data terbaru:');
    data.slice(0, 5).forEach((opp, idx) => {
      console.log(`  ${idx + 1}. ${opp.event_name.substring(0, 60)}...`);
      console.log(`     Detected: ${opp.detected_at.substring(0, 10)}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✓ UPDATE SELESAI!');
    console.log('✓ Silakan refresh halaman dashboard untuk melihat data baru');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n✗ Error saat update:');
    console.error(error.message);
    console.log('\nJika error persist, hubungi support.');
  }
})();
