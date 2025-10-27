const https = require("https");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://quran.com/fonts/quran/hafs/v1/woff2";
const OUTPUT_DIR = path.join(__dirname, "../public/font/quran-com");
const TOTAL_PAGES = 604;

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}\n`);
}

async function downloadFont(pageNum) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/p${pageNum}.woff2`;
    const outputPath = path.join(OUTPUT_DIR, `p${pageNum}.woff2`);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`✓ Page ${pageNum} already exists`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(outputPath);

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to download page ${pageNum}: ${response.statusCode}`
            )
          );
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log(`✓ Downloaded page ${pageNum}`);
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
  });
}

async function downloadAll() {
  console.log(`🚀 Starting download of ${TOTAL_PAGES} Quran.com font files...`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  const startTime = Date.now();

  // Download in batches of 10 to avoid overwhelming the server
  const BATCH_SIZE = 10;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 1; i <= TOTAL_PAGES; i += BATCH_SIZE) {
    const batch = [];
    const end = Math.min(i + BATCH_SIZE - 1, TOTAL_PAGES);

    console.log(`\n📥 Downloading pages ${i}-${end}...`);

    for (let page = i; page <= end; page++) {
      batch.push(
        downloadFont(page)
          .then(() => successCount++)
          .catch(() => errorCount++)
      );
    }

    try {
      await Promise.all(batch);
    } catch (error) {
      console.error(`❌ Error in batch ${i}-${end}:`, error.message);
    }

    // Small delay between batches
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Download complete!`);
  console.log(`📊 Success: ${successCount} | Errors: ${errorCount}`);
  console.log(`⏱️  Time: ${duration}s`);
  console.log(`📁 Location: ${OUTPUT_DIR}`);
  console.log(`${"=".repeat(50)}\n`);
}

downloadAll().catch(console.error);
