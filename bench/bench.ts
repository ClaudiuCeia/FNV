import { FNV } from "../src/FNV.ts";
import { crypto } from "https://deno.land/std@0.148.0/crypto/mod.ts";
import { encode } from "https://deno.land/std@0.148.0/encoding/hex.ts";

const target = Math.random().toString(36).slice(2, 7).repeat(1024);
Deno.bench("FNV", { group: "string" }, () => {
  FNV.update(target).digest("hex");
});

Deno.bench("FNV std", { group: "string", baseline: true }, async () => {
  new TextDecoder().decode(
    encode(
      new Uint8Array(
        await crypto.subtle.digest("FNV64A", new TextEncoder().encode(target))
      )
    )
  );
});
