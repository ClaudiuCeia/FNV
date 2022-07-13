import { Range } from "./Range.ts";
import { Buffer } from "https://deno.land/std@0.134.0/node/buffer.ts";

type FNVCompressTarget = Range<1, 16>;

/**
 * An implementation of the 32 bit FNV-1a algorithm
 * http://www.isthe.com/chongo/tech/comp/fnv/
 */
export class FNV {
  private constructor(private readonly hash: bigint) {}

  public static update(data: string): FNV {
    const buffer = Buffer.from(data);
    // Offset basis for 64 bit
    let hash = 14695981039346656037n;
    const prime = 1099511628211n;

    for (let i = 0; i < data.length; i++) {
      hash ^= BigInt(buffer[i]);
      hash = BigInt.asUintN(64, hash * prime);
    }

    return new FNV(hash);
  }

  public digest(encoding?: unknown): string {
    encoding = encoding || "binary";
    const buffer = Buffer.alloc(8);
    buffer.writeBigUInt64BE(this.value(), 0);
    return buffer.toString(encoding);
  }

  public static compress(size: FNVCompressTarget, value: bigint): bigint {
    const mask = (1 << size) - 1;
    return ((value >> BigInt(size)) ^ value) & BigInt(mask);
  }

  public value(): bigint {
    return this.hash;
  }
}
