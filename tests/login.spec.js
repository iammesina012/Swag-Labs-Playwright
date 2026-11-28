import { test, expect } from "@playwright/test";

// Type the username and password, then click Login
async function login(page, username, password) {
  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

// runs automatically BEFORE EACH test: open the login page
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

// Login successfully with valid credentials
test("should login successfully with valid credentials", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await expect(page).toHaveURL(/inventory/);
});

// Display an error message when username is WRONG
test("should display error when username is wrong", async ({ page }) => {
  await login(page, "wrong_user", "secret_sauce");
  await expect(page.getByRole("alert")).toContainText(
    "Username and password do not match",
  );
  await expect(page).not.toHaveURL(/inventory/);
});

// Display an error message when password is WRONG
test("should display error when password is wrong", async ({ page }) => {
  await login(page, "standard_user", "wrong_pass");
  await expect(page.getByRole("alert")).toContainText(
    "Username and password do not match",
  );
  await expect(page).not.toHaveURL(/inventory/);
});

// Display an error message when username is EMPTY
test("should display error when username is empty", async ({ page }) => {
  await login(page, "", "secret_sauce");
  await expect(page.getByRole("alert")).toContainText("Username is required");
  await expect(page).not.toHaveURL(/inventory/);
});

// Display an error message when password is EMPTY
test("should display error when password is empty", async ({ page }) => {
  await login(page, "standard_user", "");
  await expect(page.getByRole("alert")).toContainText("Password is required");
  await expect(page).not.toHaveURL(/inventory/);
});

// Display an error message when both fields are EMPTY
test("should display error when both fields are empty", async ({ page }) => {
  await login(page, "", "");
  await expect(page.getByRole("alert")).toContainText("Username is required");
  await expect(page).not.toHaveURL(/inventory/);
});

// Display an error message when locked-out user attempts to log in
test("should display error when locked-out user attempts to log in", async ({
  page,
}) => {
  await login(page, "locked_out_user", "secret_sauce");
  await expect(page.getByRole("alert")).toContainText(
    "Sorry, this user has been locked out",
  );
  await expect(page).not.toHaveURL(/inventory/);
});

// Display an error and go back to the login page when opening the products page without logging in
test("should not open products page when not logged in", async ({ page }) => {
  await page.goto("/inventory.html");
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("alert")).toContainText(
    "You can only access '/inventory.html' when you are logged in",
  );
});

// Close the error message when clicking the X button
test("should close an error message", async ({ page }) => {
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "Dismiss error" }).click();
  await expect(page.getByRole("alert")).toBeHidden();
});

// Treat username as case-sensitive: display an error when the capital letters are wrong
test("should treat username as case-sensitive", async ({ page }) => {
  await login(page, "Standard_user", "secret_sauce");
  await expect(page.getByRole("alert")).toContainText(
    "Username and password do not match",
  );
  await expect(page).not.toHaveURL(/inventory/);
});

// Login successfully when pressing ENTER instead of clicking the Login button
test("should login successfully when pressing Enter", async ({ page }) => {
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByPlaceholder("Password").press("Enter");
  await expect(page).toHaveURL(/inventory/);
});
