import {
  assertEquals,
  AssertionError,
} from "https://deno.land/std@0.120.0/testing/asserts.ts";
import { FNV } from "../src/FNV.ts";

Deno.test("hash", () => {
  assertEquals(FNV.update("hello world").digest("hex"), "779a65e7023cd2e7");
  assertEquals(FNV.update("42").digest("hex"), "07ee7e07b4b19223");
  assertEquals(FNV.update("FNV").digest("hex"), "f32bbe199cf22f39");
});

Deno.test("bigint", () => {
  assertEquals(FNV.update("").value(), 14695981039346656037n);
  assertEquals(FNV.update("hello").value(), 11831194018420276491n);
  assertEquals(FNV.update("hello world").value(), 8618312879776256743n);
});

Deno.test("compress", () => {
  assertEquals(FNV.compress(4, FNV.update("hello world").value()).value(), 9n);
  assertEquals(FNV.compress(8, FNV.update("hello world").value()).value(), 53n);
  assertEquals(
    FNV.compress(10, FNV.update("hello world").value()).value(),
    467n
  );
  assertEquals(
    FNV.compress(12, FNV.update("hello world").value()).value(),
    298n
  );
  assertEquals(
    FNV.compress(15, FNV.update("hello world").value()).value(),
    22174n
  );
});

/**
 * We expect collisions at sqrt(2 ^ BIT_COUNT) hashes.
 * Validate this by generating a bunch of these sequences
 * and validating that the collision count averages under 1q
 * per sequence.
 */
Deno.test("dispersion for < 16 bit hashes", () => {
  const genAndCountDuplicates = (): number => {
    const hashes = [];
    for (let i = 0; i < Math.sqrt(2 ** 12); i++) {
      hashes.push(
        FNV.compress(12, FNV.update(globalThis.crypto.randomUUID()).value())
      );
    }

    return hashes.length - new Set(hashes).size;
  };

  function assertLessThan(
    actual: number,
    expected: number,
    msg?: string
  ): void {
    if (actual >= expected) {
      if (!msg) {
        msg = `actual: "${actual}" expected to be a less than : "${expected}"`;
      }
      throw new AssertionError(msg);
    }
  }

  const counts = new Array(100).map(() => genAndCountDuplicates());
  const sum = counts.reduce((acc, val) => acc + val, 0);
  assertLessThan(sum / counts.length, 1);
});
