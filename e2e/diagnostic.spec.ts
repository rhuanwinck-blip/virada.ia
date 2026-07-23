import { expect, test } from "@playwright/test";

test("navigate the Personal OS and connect Open Finance sandbox", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /sua vida inteira/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /conhecer meu sistema pessoal/i }).first()).toBeVisible();
  await page.getByRole("link", { name: /abrir demo/i }).click();

  await expect(page.getByRole("heading", { name: /sua vida está conectada/i })).toBeVisible();
  await page.getByRole("button", { name: /finan/i }).first().click();
  await expect(page.getByRole("heading", { name: /extrato unificado/i })).toBeVisible();
  await page.getByRole("button", { name: /conectar conta banc/i }).click();
  await expect(page.getByText(/backend validou|sincronizou/i)).toBeVisible();

  await page.getByRole("button", { name: /extrato/i }).click();
  await expect(page.getByText(/dado bruto preservado/i).first()).toBeVisible();

  await page.getByRole("button", { name: /agenda/i }).first().click();
  await page.getByRole("button", { name: /classificar/i }).click();
  await expect(page.getByText(/finanças \+ agenda \+ início/i)).toBeVisible();
});
