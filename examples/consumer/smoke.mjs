#!/usr/bin/env node
/**
 * 소비 프로젝트 스모크 테스트 (결정적, Claude 미사용).
 *
 * 라이브러리(@eromnet/bo-ui-kit)를 설치·import 한 외부 앱을 실제 브라우저에서 띄워,
 * 컴포넌트가 **올바른 토큰 스타일로 렌더되는지** 검증한다. 라이브러리(빌드/exports/CSS)가
 * 소비자 관점에서 깨지면 여기서 실패한다.
 *
 * 전제: examples/consumer 의 dev 서버(:5174)가 떠 있어야 한다(CI 가 백그라운드로 띄움).
 *       서버가 뜰 때까지 폴링하므로 별도 wait 불필요.
 * 종료: 모든 단언 통과 0 / 하나라도 실패 1.
 */
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";

const URL = "http://localhost:5174";
const SHOT = fileURLToPath(new URL("smoke.png", import.meta.url));

async function waitForServer(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`서버가 ${tries}s 안에 뜨지 않음: ${url}`);
}

function assertEq(name, actual, expected) {
  if (actual !== expected) {
    throw new Error(`❌ ${name}: 기대 ${expected}, 실제 ${actual}`);
  }
  console.log(`✓ ${name} = ${actual}`);
}
function assertTrue(name, cond, detail = "") {
  if (!cond) throw new Error(`❌ ${name} 실패 ${detail}`);
  console.log(`✓ ${name}${detail ? ` (${detail})` : ""}`);
}

console.log(`» 서버 대기: ${URL}`);
await waitForServer(URL);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 480, height: 900 } });
let failed = false;
try {
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-test="buttons"] button', { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);

  const d = await page.evaluate(() => {
    const bg = (el) => (el ? getComputedStyle(el).backgroundColor : null);
    const buttons = [...document.querySelectorAll('[data-test="buttons"] button')];
    const meterInd = document.querySelector('[data-node-id="7664:44"]');
    const otp = document.querySelector('[data-node-id="8060:1580"]');
    const largeSlots = otp
      ? [...otp.querySelectorAll("div")].filter((e) => {
          const c = getComputedStyle(e);
          return c.width === "36px" && c.height === "36px";
        }).length
      : 0;
    return {
      defaultButtonBg: bg(buttons[0]),
      destructiveButtonBg: bg(buttons[1]),
      meterIndicatorBg: bg(meterInd),
      meterIndicatorWidthPx: meterInd ? parseFloat(getComputedStyle(meterInd).width) : 0,
      otpLargeSlots: largeSlots,
      hasMeter: !!document.querySelector('[role="meter"]'),
      hasInput: !!document.querySelector("input"),
      hasLabel: !!document.querySelector("label"),
    };
  });

  await page.screenshot({ path: SHOT });

  // ── 단언: styles.css 가 토큰을 실제로 적용했는지 ──
  assertEq("Default 버튼 = primary", d.defaultButtonBg, "rgb(43, 127, 255)");
  assertEq("Destructive 버튼 = destructive", d.destructiveButtonBg, "rgb(239, 68, 68)");
  assertEq("Meter 인디케이터 = primary", d.meterIndicatorBg, "rgb(43, 127, 255)");
  assertTrue("Meter 채움 너비 > 0 (value 반영)", d.meterIndicatorWidthPx > 10, `${d.meterIndicatorWidthPx}px`);
  assertEq("InputOTP isLarge 슬롯 6개(36px)", d.otpLargeSlots, 6);
  assertTrue("Meter/Input/Label 렌더", d.hasMeter && d.hasInput && d.hasLabel);

  console.log("\n✅ 스모크 통과 — 라이브러리가 외부 프로젝트에서 정상 렌더+스타일됨");
} catch (e) {
  failed = true;
  console.error(`\n${e.message}`);
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
