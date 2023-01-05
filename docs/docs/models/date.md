---
sidebar_position: 5
tags: [date]
---

# Date

## Module to generate dates.

:::info

For more **schema options** refer, [faker.js documentation](https://fakerjs.dev/).

:::

### between

Generates a random date between the given boundaries.

| Option | Description              |
| :----: | ------------------------ |
|  from  | The early date boundary. |
|   to   | The late date boundary.  |

#### Input:

|        from         |         to          |
| :-----------------: | :-----------------: |
| 2020-01-01 00:00:00 | 2030-01-01 00:00:00 |

#### output

```json
2026-05-16T02:22:53.002Z
```

### betweens

Generates a random date between the given boundaries.

|     Option      | Description                      |
| :-------------: | -------------------------------- |
|      from       | The early date boundary.         |
|       to        | The late date boundary.          |
| number of dates | The number of dates to generate. |

#### Input:

|        from         |         to          | number of dates |
| :-----------------: | :-----------------: | :-------------: |
| 2020-01-01 00:00:00 | 2030-01-01 00:00:00 |        2        |

#### output

```json
[ 2023-05-02T16:00:00.000Z, 2026-09-01T08:00:00.000Z ]
```

### birthdate

Returns a random birthdate.

|   Option    | Description                                                                                                                                                                                                                                                                                                          |
| :---------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| minimum age | The minimum age or year to generate a birthdate.                                                                                                                                                                                                                                                                     |
| maximum age | The maximum age or year to generate a birthdate.                                                                                                                                                                                                                                                                     |
|    mode     | The mode to generate the birthdate. Supported modes are 'age' and 'year' .<br />There are two modes available 'age' and 'year': <br />'age': The min and max options define the age of the person (e.g. 18 - 42). <br />'year': The min and max options define the range the birthdate may be in (e.g. 1900 - 2000). |

#### Input:

| minimum age | maximum age |  mode  |          Output          |
| :---------: | :---------: | :----: | :----------------------: |
|     18      |     65      | "age"  | 2003-11-02T20:03:20.116Z |
|    1900     |    2000     | "year" | 1940-08-20T08:53:07.538Z |

### future

Generates a random date in the future.

| Option | Description                                       |
| :----: | ------------------------------------------------- |
| years  | The range of years the date may be in the future. |

#### Input:

| years |
| :---: |
|  10   |

#### output

```json
2030-11-23T09:38:28.710Z
```

### month

Returns a random name of a month.

| Option | Description                        |
| :----: | ---------------------------------- |
|  abbr  | Whether to return an abbreviation. |

#### Input:

|      abbr      | Output  |
| :------------: | :-----: |
| "abbreviation" |   Feb   |
|  "long form"   | October |

### past

Generates a random date in the past.

|   Option   | Description                                     |
| :--------: | ----------------------------------------------- |
| past years | The range of years the date may be in the past. |

#### Input:

| past years |
| :--------: |
|     10     |

#### output

```json
2017-10-25T21:34:19.488Z
```

### recent

Generates a random date in the recent past.

|     Option      | Description                                                                       |
| :-------------: | --------------------------------------------------------------------------------- |
|      days       | The range of days the date may be in the past.                                    |
| reference point | The date to use as reference point for the newly generated date. Defaults to now. |

#### Input:

| days |   reference point   |
| :--: | :-----------------: |
|  10  | 2020-01-01 00:00:00 |

#### output

```json
2019-12-27T18:11:19.117Z
```

### soon

Generates a random date in the near future.

|     Option      | Description                                                                       |
| :-------------: | --------------------------------------------------------------------------------- |
|      days       | The range of days the date may be in the future.                                  |
| reference point | The date to use as reference point for the newly generated date. Defaults to now. |

#### Input:

| days |   reference point   |
| :--: | :-----------------: |
|  10  | 2020-01-01 00:00:00 |

#### output

```json
2020-01-01T02:40:44.990Z
```

### weekday

Returns a random day of the week.

| Option | Description                        |
| :----: | ---------------------------------- |
|  abbr  | Whether to return an abbreviation. |

#### Input:

|     abbr     |  output  |
| :----------: | :------: |
|  long form   | Thursday |
| abbreviation |   Thu    |
