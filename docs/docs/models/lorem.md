---
sidebar_position: 10
tags: [lorem]
---

# Lorem

## Module to generate random texts and words.

:::info

For more **schema options** refer, [faker.js documentation](https://fakerjs.dev/).

:::

### Lines

Generates the given number lines of lorem separated by '\n'.

| Option  | Description                                                                   |
| :-----: | ----------------------------------------------------------------------------- |
| Line no | The number of lines to generate. Defaults to a random number between 1 and 5. |

#### Input:

| Line no |
| :-----: |
|    2    |

#### output

```json
Rerum quia aliquam pariatur \n explicabo sint minima eos
```

### Sentences

Generates a space separated list of words beginning a capital letter and ending with a dot.

|     Option     | Description                                                                                        |
| :------------: | -------------------------------------------------------------------------------------------------- |
| Sentence count | The number of words, that should be in the sentence. Defaults to a random number between 3 and 10. |

#### Input:

| Sentence count |
| :------------: |
|       5        |

#### output

```json
Laborum voluptatem officiis est et.
```
