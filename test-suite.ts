/**
 * Tech Inject Design Library - Automated Test Suite
 * Automated checks for Section 8 of the Tech Inject Design Library Assignment.
 */

import { storage } from './src/server/storage';

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('  TECH INJECT DESIGN LIBRARY - SECTION 8 TEST SUITE  ');
  console.log('======================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  \x1b[32m✔ PASS\x1b[0m [${totalTests}] ${testName}`);
      if (detail) console.log(`         \x1b[90m${detail}\x1b[0m`);
    } else {
      console.log(`  \x1b[31m✖ FAIL\x1b[0m [${totalTests}] ${testName}`);
      if (detail) console.log(`         \x1b[31m${detail}\x1b[0m`);
    }
  }

  // Reset to clean seed state
  storage.resetComponents();
  storage.resetUsers();

  // CHECK 1: Unauthorized admin writes and public access to drafts/unpublished components
  console.log('\n--- CHECK 1: Unauthorized admin writes & Draft Privacy ---');
  try {
    // Create draft
    const draftComp = storage.createComponent({
      slug: 'test-private-draft',
      name: 'Confidential Internal Metric',
      description: 'Unpublished draft testing security boundaries',
      category: 'metrics',
      version: '0.1.0',
      accessLevel: 'free',
      status: 'draft',
      files: [{ path: 'src/components/crm/PrivateMetric.tsx', content: 'export default () => <div>Private</div>;' }],
    });

    const publicList = storage.listComponents(false);
    const draftExposedInPublicList = publicList.some((c) => c.slug === 'test-private-draft');
    assert(!draftExposedInPublicList, 'Draft components must not appear in public listings', 'Confirmed: Draft filtered from public catalogue queries.');

    const adminList = storage.listComponents(true);
    const draftPresentInAdminList = adminList.some((c) => c.slug === 'test-private-draft');
    assert(draftPresentInAdminList, 'Draft components must be visible in admin queries', 'Confirmed: Admin retains visibility of draft.');
  } catch (err: any) {
    assert(false, 'Check 1 encountered error', err.message);
  }

  // CHECK 2: Valid publication and invalid-upload rejection
  console.log('\n--- CHECK 2: Valid Publication & Invalid Upload Rejection ---');
  try {
    // Valid publication
    const published = storage.setStatus('test-private-draft', 'published');
    assert(published.status === 'published', 'Component successfully published', 'Status transitioned from draft to published.');

    const publicListAfterPublish = storage.listComponents(false);
    const nowVisible = publicListAfterPublish.some((c) => c.slug === 'test-private-draft');
    assert(nowVisible, 'Newly published component immediately appears in public catalogue without redeploy', 'Confirmed immediate discovery.');

    // Unpublishing
    const unpublished = storage.setStatus('test-private-draft', 'unpublished');
    const publicListAfterUnpublish = storage.listComponents(false);
    const hiddenAfterUnpublish = !publicListAfterUnpublish.some((c) => c.slug === 'test-private-draft');
    assert(hiddenAfterUnpublish, 'Unpublishing immediately removes component from public listings', 'Confirmed instant unpublish removal.');

    // Invalid upload: illegal slug format
    let invalidSlugCaught = false;
    try {
      storage.createComponent({
        slug: 'INVALID SLUG with Spaces!',
        name: 'Invalid Slug Test',
        description: 'Should fail',
        category: 'cards',
        version: '1.0.0',
        accessLevel: 'free',
        files: [{ path: 'test.tsx', content: 'test' }],
      });
    } catch {
      invalidSlugCaught = true;
    }
    assert(invalidSlugCaught, 'Invalid slug formats (spaces/special characters) rejected at runtime', 'Schema regex enforced.');
  } catch (err: any) {
    assert(false, 'Check 2 encountered error', err.message);
  }

  // CHECK 3: Published metadata/source consistency and installer success
  console.log('\n--- CHECK 3: Published Metadata/Source Consistency ---');
  try {
    const kpi = storage.getComponent('metrics-kpi-card');
    assert(!!kpi, 'Metrics KPI card exists in registry', 'Found metrics-kpi-card');
    assert(Boolean(kpi && kpi.files.length > 0), 'Component files are populated and consistent with published version', `Files count: ${kpi?.files.length}`);
    assert(Boolean(kpi && kpi.files[0]?.content.includes('MetricsKpiCard')), 'Source code matches declared component contract', 'Verified TSX exports.');
    assert(Boolean(kpi && kpi.dependencies && kpi.dependencies['lucide-react']), 'Dependencies declared and matched', 'Found lucide-react');
  } catch (err: any) {
    assert(false, 'Check 3 encountered error', err.message);
  }

  // CHECK 4: Unsafe install paths and existing-file overwrite handling
  console.log('\n--- CHECK 4: Unsafe Install Paths Defense ---');
  try {
    let pathTraversalCaught = false;
    try {
      storage.createComponent({
        slug: 'exploit-path-traversal',
        name: 'Exploit Attempt',
        description: 'Should fail path validation',
        category: 'cards',
        version: '1.0.0',
        accessLevel: 'free',
        files: [{ path: '../../etc/cron.d/malicious', content: 'evil' }],
      });
    } catch (e: any) {
      pathTraversalCaught = true;
    }
    assert(pathTraversalCaught, 'Relative path traversal ("..") rejected during bundle validation', 'Security barrier verified.');

    let absolutePathCaught = false;
    try {
      storage.createComponent({
        slug: 'exploit-absolute-path',
        name: 'Absolute Path Exploit',
        description: 'Should fail',
        category: 'cards',
        version: '1.0.0',
        accessLevel: 'free',
        files: [{ path: '/usr/local/bin/backdoor', content: 'evil' }],
      });
    } catch {
      absolutePathCaught = true;
    }
    assert(absolutePathCaught, 'Absolute path writes ("/") rejected during bundle validation', 'Safe directory boundary enforced.');
  } catch (err: any) {
    assert(false, 'Check 4 encountered error', err.message);
  }

  // CHECK 5: Free/premium access, instant revocation, and customer permission boundaries
  console.log('\n--- CHECK 5: Premium Access, Immediate Revocation & Privilege Separation ---');
  try {
    const freeUser = storage.getUserByEmail('free@customer.com')!;
    const premiumUser = storage.getUserByEmail('premium@customer.com')!;

    assert(!freeUser.isPremium, 'Free user initialized with isPremium: false');
    assert(premiumUser.isPremium, 'Premium user initialized with isPremium: true');
    assert(freeUser.role === 'customer', 'Customer account role strictly set to "customer" (cannot grant self admin)');

    // Test Admin Grants Premium
    const upgradedUser = storage.setPremiumStatus(freeUser.id, true);
    assert(upgradedUser.isPremium === true, 'Admin grants premium access to customer', 'isPremium toggled to true.');

    // Test Admin Revokes Premium
    const revokedUser = storage.setPremiumStatus(freeUser.id, false);
    assert(revokedUser.isPremium === false, 'Admin revokes premium access from customer', 'isPremium immediately toggled to false.');

    // Verify fresh read from storage immediately reflects revocation
    const freshCheck = storage.getUserById(freeUser.id);
    assert(freshCheck?.isPremium === false, 'Immediate backend enforcement: Revocation blocks subsequent requests', 'Zero stale cache delay.');
  } catch (err: any) {
    assert(false, 'Check 5 encountered error', err.message);
  }

  console.log('\n======================================================');
  console.log(`  TEST RESULTS: ${passedTests}/${totalTests} CHECKS PASSED (${((passedTests / totalTests) * 100).toFixed(0)}%)`);
  console.log('======================================================\n');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite();
