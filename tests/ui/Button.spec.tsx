import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from '@repo/ui';

test.describe('Button Component', () => {
  test('renders button with text', async ({ mount }) => {
    const component = await mount(<Button>Click me</Button>);
    await expect(component).toContainText('Click me');
  });

  test('renders primary variant', async ({ mount }) => {
    const component = await mount(<Button variant="primary">Primary</Button>);
    await expect(component).toHaveClass(/bg-blue-600/);
  });

  test('renders secondary variant', async ({ mount }) => {
    const component = await mount(<Button variant="secondary">Secondary</Button>);
    await expect(component).toHaveClass(/bg-gray-600/);
  });

  test('handles loading state', async ({ mount }) => {
    const component = await mount(<Button loading>Loading</Button>);
    await expect(component).toBeDisabled();
    await expect(component.locator('svg')).toBeVisible();
  });

  test('handles disabled state', async ({ mount }) => {
    const component = await mount(<Button disabled>Disabled</Button>);
    await expect(component).toBeDisabled();
  });
});
