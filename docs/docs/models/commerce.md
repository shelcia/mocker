---
sidebar_position: 3
tags: [commerce]
---

# Commerce

## Module to generate commerce and product related entries.

:::info

For more **schema options** refer, [faker.js documentation](https://fakerjs.dev/).

:::

### product

Returns a short product name.

#### output

```json
Computer
```

### productDescription

Returns a product description.

#### output

```json
The Football Is Good For Training And Recreati...
```

### price

Generates a price between min and max (inclusive).

| Option | Description        |
| :----: | ------------------ |
|  min   | The minimum price. |
|  max   | The maximum price. |

#### Input:

| min | max |
| :-: | :-: |
| 100 | 200 |

#### output

```json
114
```

### productAdjective

Returns an adjective describing a product.

#### output

```json
Handcrafted
```
