
import { test, expect } from '@playwright/test';

test.describe('Dark Mode Functionality', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the home page before each test
        await page.goto('http://localhost:5173');
    });

    test('should load with default theme and toggle manually', async ({ page }) => {
        // Check if the html tag has either 'light' or 'dark' class (or no class if system default)
        const html = page.locator('html');

        // Find the theme toggle button
        const toggle = page.getByLabel('Toggle theme');
        await expect(toggle).toBeVisible();

        // Get initial theme
        const initialClass = await html.getAttribute('class') || '';
        console.log(`Initial theme class: ${initialClass}`);

        // Click toggle to change theme
        await toggle.click();

        // Check if theme changed
        const toggledClass = await html.getAttribute('class') || '';
        console.log(`Toggled theme class: ${toggledClass}`);
        expect(toggledClass).not.toBe(initialClass);

        // Verify it persists after reload
        await page.reload();
        const afterReloadClass = await html.getAttribute('class') || '';
        expect(afterReloadClass).toBe(toggledClass);
    });

    test('should appear in mobile menu', async ({ page }) => {
        // Set viewport to mobile
        await page.setViewportSize({ width: 375, height: 667 });

        // Toggle button should be visible in the navbar even on mobile (as per implementation)
        const toggle = page.getByLabel('Toggle theme');
        await expect(toggle).toBeVisible();
    });
});
