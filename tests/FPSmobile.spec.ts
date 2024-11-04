import { test, expect, devices } from '@playwright/test';

test.use({
    ...devices['iPhone 12'],
    viewport: { width: 390, height: 844 }
  });

test.describe('Three.js FPS Performance Test for Mobile', () => {

  test('should measure and verify FPS of the Three.js scene on mobile', async ({ page }) => {
    await page.goto('https://threejs.org/examples/#webgl_instancing_performance');

    const iframeElement = await page.waitForSelector('#viewer', { timeout: 20000 });
    const frame = await iframeElement.contentFrame();

    expect(frame).not.toBeNull();

    if (frame === null) {
      return;
    }

    let fps = '';
    for (let i = 0; i < 5; i++) {
      try {
        fps = await frame.evaluate(async () => {
          let frameCount = 0;
          const start = performance.now();

          return await new Promise((resolve) => {
            function measureFPS() {
              frameCount++;
              const elapsed = performance.now() - start;
              if (elapsed < 5000) { 
                requestAnimationFrame(measureFPS);
              } else {
                resolve((frameCount / 5).toFixed(2));
              }
            }
            measureFPS();
          });
        });
        break;
      } catch (e) {
        console.warn('Retrying FPS measurement due to navigation interruption...');
        await page.waitForTimeout(1000);
      }
    }

    console.log(`Average FPS on mobile: ${fps}`);
    expect(Number(fps)).toBeGreaterThan(30); 
  });
});
