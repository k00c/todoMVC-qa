#!/usr/bin/env node

/**
 * Analyze Playwright test performance from JSON report
 * Usage: node analyze-test-performance.js
 */

const fs = require("fs");
const path = require("path");

const resultsPath = path.join(__dirname, "test-results", "test-results.json");

if (!fs.existsSync(resultsPath)) {
  console.error(
    "❌ No test results found. Run: npx playwright test --project=chromium",
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(resultsPath, "utf8"));

// Extract all test results with timing data
const tests = [];
data.suites.forEach((suite) => {
  if (suite.suites) {
    suite.suites.forEach((innerSuite) => {
      if (innerSuite.specs) {
        innerSuite.specs.forEach((spec) => {
          spec.tests.forEach((test) => {
            test.results.forEach((result) => {
              tests.push({
                file: suite.file,
                suite: innerSuite.title,
                name: spec.title,
                duration: result.duration,
                status: result.status,
              });
            });
          });
        });
      }
    });
  }
});

// Sort by duration (slowest first)
tests.sort((a, b) => b.duration - a.duration);

// Calculate statistics
const totalDuration = tests.reduce((sum, t) => sum + t.duration, 0);
const avgDuration = totalDuration / tests.length;
const passedTests = tests.filter((t) => t.status === "passed").length;
const failedTests = tests.filter((t) => t.status === "failed").length;

console.log("📊 TEST PERFORMANCE ANALYSIS");
console.log("=".repeat(80));
console.log(`Total Tests: ${tests.length}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`⏱️  Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
console.log(`📈 Average Duration: ${(avgDuration / 1000).toFixed(2)}s`);
console.log();

console.log("🐌 SLOWEST TESTS (> 5 seconds):");
console.log("-".repeat(80));
tests
  .filter((t) => t.duration > 5000)
  .forEach((t, i) => {
    console.log(
      `${i + 1}. [${(t.duration / 1000).toFixed(2)}s] ${t.suite} › ${t.name}`,
    );
    console.log(`   File: ${t.file}`);
  });
console.log();

console.log("⚡ FASTEST TESTS (< 1 second):");
console.log("-".repeat(80));
tests
  .filter((t) => t.duration < 1000)
  .slice(0, 10)
  .forEach((t, i) => {
    console.log(
      `${i + 1}. [${(t.duration / 1000).toFixed(2)}s] ${t.suite} › ${t.name}`,
    );
  });
console.log();

console.log("📂 PERFORMANCE BY TEST FILE:");
console.log("-".repeat(80));
const byFile = {};
tests.forEach((t) => {
  if (!byFile[t.file]) {
    byFile[t.file] = { count: 0, totalDuration: 0 };
  }
  byFile[t.file].count++;
  byFile[t.file].totalDuration += t.duration;
});

Object.entries(byFile)
  .sort((a, b) => b[1].totalDuration - a[1].totalDuration)
  .forEach(([file, stats]) => {
    const avgDur = stats.totalDuration / stats.count;
    console.log(
      `${file}: ${stats.count} tests, ${(stats.totalDuration / 1000).toFixed(2)}s total, ${(avgDur / 1000).toFixed(2)}s avg`,
    );
  });
