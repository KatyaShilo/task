import { test, expect, devices } from '@playwright/test';

test.use({
    // Use Playwright's predefined mobile device emulation for iPhone 12
    ...devices['iPhone 12'],
    viewport: { width: 390, height: 844 }, // Customize if needed
  });

test.describe('Three.js FPS Performance Test for Mobile', () => {

  test('should measure and verify FPS of the Three.js scene on mobile', async ({ page }) => {
    await page.goto('https://threejs.org/examples/#webgl_instancing_performance');

    // Wait for the iframe to load and be accessible
    const iframeElement = await page.waitForSelector('#viewer', { timeout: 20000 });
    const frame = await iframeElement.contentFrame();

    expect(frame).not.toBeNull();

    if (frame === null) {
      return;
    }

    let fps = '';
    for (let i = 0; i < 5; i++) { // Retry up to 5 times
      try {
        fps = await frame.evaluate(async () => {
          let frameCount = 0;
          const start = performance.now();

          return await new Promise((resolve) => {
            function measureFPS() {
              frameCount++;
              const elapsed = performance.now() - start;
              if (elapsed < 5000) { // Measure over 5 seconds
                requestAnimationFrame(measureFPS);
              } else {
                resolve((frameCount / 5).toFixed(2)); // Average FPS over 5 seconds
              }
            }
            measureFPS();
          });
        });
        break; // Exit loop if successful
      } catch (e) {
        console.warn('Retrying FPS measurement due to navigation interruption...');
        await page.waitForTimeout(1000); // Wait briefly before retrying
      }
    }

    console.log(`Average FPS on mobile: ${fps}`);
    expect(Number(fps)).toBeGreaterThan(30); // Set a mobile-friendly FPS threshold
  });
});
