import { test, expect } from '@playwright/test';

test.describe('Three.js FPS Performance Test on desktop', () => {
  test('To mesure and verify FPS of the Three.js scene', async ({ page }) => {
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

    console.log(`Average FPS: ${fps}`);
    expect(Number(fps)).toBeGreaterThan(57); 
  });
});
