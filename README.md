[Slonik](https://github.com/gajus/slonik) is 10x solwer when used with ncc

Here are the performances compared to pg with and without ncc

```
// Without ncc

pg - query: 7.775ms
pg - end: 0.986ms
slonik - query: 12.771ms
slonik - end: 0.629ms

// With ncc
ncc-pg - query: 10.152ms
ncc-pg - end: 1.357ms
ncc-slonik - query: 546.402ms
ncc-slonik - end: 0.948ms
```

If you have docker setup on your machine, you can reproduce the benchmark by running

```
npm install
npm test
```