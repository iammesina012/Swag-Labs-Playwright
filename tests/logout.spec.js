import { test, expect } from "@playwright/test";

// Open the menu, click Logout, and check we are back on the login page
async function logout(page) {
  await page.getByRole("button", { name: "Open Menu" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL("/");
}

// runs automatically BEFORE EACH test
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/inventory/);
});

// Logout successfully and go back to the login page
test("should logout successfully", async ({ page }) => {
  await logout(page);
});

// Display an error and go back to the login page when opening the products page after logging out
test("should not open products page after logging out", async ({ page }) => {
  await logout(page);
  await page.goto("/inventory.html");
  await expect(page.getByRole("alert")).toContainText(
    "You can only access '/inventory.html' when you are logged in",
  );
});

// Display an error when pressing the browser Back button after logging out
test("should not open products page when pressing Back after logging out", async ({
  page,
}) => {
  await logout(page);
  await page.goBack();
  await expect(page.getByRole("alert")).toContainText(
    "You can only access '/inventory.html' when you are logged in",
  );
});

// Login successfully again after logging out
test("should login again after logging out", async ({ page }) => {
  await logout(page);
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/inventory/);
});

// Logout successfully when the user is on the cart page
test("should logout successfully from the cart page", async ({ page }) => {
  await page.getByRole("button", { name: "Cart, empty" }).click();
  await expect(page).toHaveURL(/cart/);
  await logout(page);
});
