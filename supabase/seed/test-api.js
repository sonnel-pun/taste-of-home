// Test the API route locally
require('dotenv').config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('=== Testing API Route ===\n');

  // Test 1: Search by dish name
  console.log('Test 1: Search "char siu"');
  const r1 = await fetch(`${BASE_URL}/api/dishes/search?q=char`);
  const j1 = await r1.json();
  console.log(`  Status: ${r1.status}`);
  console.log(`  Results: ${j1.data?.length || 0}`);
  j1.data?.slice(0, 2).forEach((d: any) => {
    console.log(`  → ${d.dish?.emoji} ${d.dish?.name_en} @ ${d.place?.name} (${d.authenticityScore}%)`);
  });

  // Test 2: Filter by mood
  console.log('\nTest 2: Filter by mood "homesick"');
  const r2 = await fetch(`${BASE_URL}/api/dishes/search?mood=homesick`);
  const j2 = await r2.json();
  console.log(`  Status: ${r2.status}`);
  console.log(`  Results: ${j2.data?.length || 0}`);
  j2.data?.forEach((d: any) => {
    console.log(`  → ${d.dish?.name_en} @ ${d.place?.name}`);
    d.stories?.forEach((s: any) => console.log(`     "${s.text.substring(0, 50)}..."`));
  });

  // Test 3: Filter by type
  console.log('\nTest 3: Filter by type "grocery"');
  const r3 = await fetch(`${BASE_URL}/api/dishes/search?type=grocery`);
  const j3 = await r3.json();
  console.log(`  Status: ${r3.status}`);
  console.log(`  Results: ${j3.data?.length || 0}`);
  j3.data?.forEach((d: any) => {
    console.log(`  → ${d.dish?.name_en} @ ${d.place?.name} [${d.place?.type}]`);
  });

  // Test 4: Geo search (near Queensway)
  console.log('\nTest 4: Geo search near Queensway (51.5103, -0.1887)');
  const r4 = await fetch(`${BASE_URL}/api/dishes/search?lat=51.5103&lng=-0.1887&radius_km=5`);
  const j4 = await r4.json();
  console.log(`  Status: ${r4.status}`);
  console.log(`  Results: ${j4.data?.length || 0}`);
  j4.data?.forEach((d: any) => {
    console.log(`  → ${d.place?.name}`);
  });

  // Test 5: Invalid query
  console.log('\nTest 5: Invalid query (bad min_score)');
  const r5 = await fetch(`${BASE_URL}/api/dishes/search?min_score=999`);
  const j5 = await r5.json();
  console.log(`  Status: ${r5.status}`);
  console.log(`  Error: ${j5.error}`);

  console.log('\n=== API Tests Complete ===');
}

testAPI().catch(err => {
  console.error('Error:', err.message);
  console.log('\n💡 Make sure the dev server is running: npm run dev');
});
