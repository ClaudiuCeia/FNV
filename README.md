# FNV

An implementation of the [64 bit FNV-1a algorithm](http://www.isthe.com/chongo/tech/comp/fnv/).

## Example
```ts
FNV.update("hello world").digest("hex"); // 779a65e7023cd2e7
FNV.update("hello world").value(); // 8618312879776256743n
FNV.compress(4, FNV.update("hello world").value(); // 9n
```


