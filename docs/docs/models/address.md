---
sidebar_position: 1
tags: [address]
---

# Address

## Module to generate addresses and locations.

:::info

For more **schema options** refer, [faker.js documentation](https://fakerjs.dev/).

:::

### buildingNumber

Generates a random building number.

#### output

```json
5786
```

### cardinalDirection

Returns a random cardinal direction (north, east, south, west).

| Option  | Description                                                                                            |
| :-----: | ------------------------------------------------------------------------------------------------------ |
| useAbbr | If true this will return abbreviated directions (N, E, etc). Otherwise this will return the long name. |

#### Input:

| useAbbr |
| :-----: |
|  false  |

#### output

```json
South
```

### city

Generates a random localized city name.

#### output

```json
East Jarretmouth
```

### cityName

Returns a random localized and existing city name.

#### output

```json
San Rafael
```

### cityPrefix

Returns a random localized city prefix.

#### output

```json
East
```

### citySuffix

Returns a random localized city suffix.

#### output

```json
stad
```

### country

Returns a random country name.

#### output

```json
Greece
```

### countryCode

Returns a random country code.

| Option    | Default | Description                                                                                   |
| :-------- | :-----: | :-------------------------------------------------------------------------------------------- |
| alphaCode | alpha-2 | The code to return. Can be either 'alpha-2' (2 letter code) or 'alpha-3' (three letter code). |

#### Input:

| alphaCode | output |
| :-------: | :----: |
|  alpha-2  |   GA   |
|  alpha-3  |  TJK   |

### county

Returns a random localized county.

#### output

```json
Cambridgeshire
```

### direction

Returns a random direction (cardinal and ordinal; northwest, east, etc).

| Option  | Description                                                                                             |
| :------ | :------------------------------------------------------------------------------------------------------ |
| useAbbr | If true this will return abbreviated directions (NW, E, etc). Otherwise this will return the long name. |

#### Input:

| useAbbr | output |
| :-----: | :----: |
|  false  | South  |
|  true   |   NE   |

### latitude

Generates a random latitude.

| Option    | Description                                                 |
| :-------- | :---------------------------------------------------------- |
| max       | The upper bound for the latitude to generate.               |
| min       | The lower bound for the latitude to generate.               |
| precision | The number of decimal points of precision for the latitude. |

#### Input:

| max | min | precision |
| :-: | :-: | :-------: |
| 10  | -10 |     5     |

#### output

```json
2.68452
```

### longitude

Generates a random longitude.

| Option    | Description                                                  |
| :-------- | :----------------------------------------------------------- |
| max       | The upper bound for the longitude to generate.               |
| min       | The lower bound for the longitude to generate.               |
| precision | The number of decimal points of precision for the longitude. |

#### Input:

| max | min | precision |
| :-: | :-: | :-------: |
| 10  | -10 |     5     |

#### output

```json
-4.0362
```

### nearbyGPSCoordinate

Generates a random GPS coordinate within the specified radius from the given coordinate.

| Option    | Description                                                                      |
| :-------- | :------------------------------------------------------------------------------- |
| latitude  | The latitude for original coordinate to get a new coordinate close to.           |
| longitude | The longitude for original coordinate to get a new coordinate close to.          |
| radius    | The maximum distance from the given coordinate to the new coordinate.            |
| metric    | If KM, assume the radius to be in kilometers. If MILE assume radius to be miles. |

#### Input:

| latitude | longitude | radius | metric |
| :------: | :-------: | :----: | :----: |
|    33    |   -170    |  1000  |  true  |

#### output

```json
[37.9163, -179.2408]
```

### ordinalDirection

Returns a random ordinal direction (northwest, southeast, etc).

| Option  | Description                                                                                              |
| :------ | :------------------------------------------------------------------------------------------------------- |
| useAbbr | If true this will return abbreviated directions (NW, SE, etc). Otherwise this will return the long name. |

#### Input:

| useAbbr |
| :-----: |
|  false  |

#### output

```json
Northwest
```

### secondaryAddress

Generates a random localized secondary address. This refers to a specific location at a given address such as an apartment or room number.

#### output

```json
Suite 578
```

### state

Returns a random localized state from this country.

#### output

```json
Georgia
```

### stateAbbr

Returns a random localized state's abbreviated name from this country.

#### output

```json
ND
```

### street

Generates a random localized street name.

#### output

```json
Schroeder Isle
```

### streetAddress

Generates a random localized street address.

| Option         | Description                                                                                    |
| :------------- | :--------------------------------------------------------------------------------------------- |
| useFullAddress | When true this will generate a full address. Otherwise it will just generate a street address. |

#### Input:

| useFullAddress |
| :------------: |
|      true      |

#### output

```json
3393 Ronny Way Apt. 742
```

### streetName

Returns a random localized street name.

#### output

```json
Cavill Avenue
```

### streetPrefix

Returns a random localized street prefix.

#### output

```json
Boame
```

### streetSuffix

Returns a random localized street suffix.

#### output

```json
Streets
```

### timeZone

Returns a random time zone.

#### output

```json
Pacific/Guam
```

### zipCode

Generates random zip code from specified format. If format is not specified, the locale's zip format is used.

| Option | Description                                                                                                             |
| :----- | :---------------------------------------------------------------------------------------------------------------------- |
| format | The optional format used to generate the the zip code. By default, a random format is used from the locale zip formats. |

#### Input:

| format |
| :----: |
|  ####  |

#### output

```json
6925
```

### zipCodeByState

Generates random zip code from state abbreviation.

| Option | Description                                                 |
| :----- | :---------------------------------------------------------- |
| state  | The abbreviation of the state to generate the zip code for. |

#### Input:

| state |
| :---: |
|  AK   |

#### output

```json
99595
```
