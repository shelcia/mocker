---
sidebar_position: 13
tags: [random]
---

# Random

### Generates random values of different kinds.

:::info

For more **schema options** refer, [faker.js documentation](https://fakerjs.dev/).

:::

### alpha

Generating a string consisting of letters in the English alphabet.

|       Option        | Description                           |
| :-----------------: | ------------------------------------- |
| number of character | The number of characters to generate. |

#### Input:

| number of character |
| :-----------------: |
|         10          |

#### output

```json
qccrabobaf
```

### alphaNumeric

Generating a string consisting of alpha characters and digits.

|              Option              | Description                                      |
| :------------------------------: | ------------------------------------------------ |
| number of alphaNumeric character | The number of characters and digits to generate. |

#### Input:

| number of alphaNumeric character |
| :------------------------------: |
|                5                 |

#### output

```json
3e5v7
```

### locale

Returns a random locale

#### output

```json
el
```

### numeric

Generates a given length string of digits.

|     Option      | Description                       |
| :-------------: | --------------------------------- |
| Number of digit | The number of digits to generate. |

#### Input:

| Number of digit |
| :-------------: |
|       42        |

#### output

```json
56434563150765416546479875435481513188548
```

### word

Returns random word.

#### output

```json
quantify
```

### words

Returns string with set of random words

|     Option     | Description          |
| :------------: | -------------------- |
| Number of word | Returns random word. |

#### Input:

| Number of word |
| :------------: |
|       5        |

#### output

```json
copy Handcrafted bus client-server Point
```

### Special character

Generates a given length string of special character.

|     Option     |                  Default                  | Description                                                          |
| :------------: | :---------------------------------------: | -------------------------------------------------------------------- |
| Number of word |                     5                     | The number of character to generate.                                 |
|   Whitelist    | !"#$%&'()\*+,-./:;\<\=\>?@[]^\_`\{\|\}~\  | Set of characters that are allowed to include in the generated data. |

#### Input:

| Number of word | Whitelist |
| :------------: | :-------: |
|       20       |   %^&\*   |

#### Output:

```json
%&%^^%^&*&^****%%^%%
```

Special character schema can also be used to generate any character and numeric data as shown:

| Number of word | Whitelist  |        Output        |
| :------------: | :--------: | :------------------: |
|       20       | qwerty1234 | 1eyw4tww3trew11eyqt1 |
