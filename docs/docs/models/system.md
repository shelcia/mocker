---
sidebar_position: 15
tags: [system]
---

# System

## Generates fake data for many computer systems properties.

:::info

For more **schema options** refer, [faker.js documentation](https://fakerjs.dev/).

:::

### commonFileExt

Returns a commonly used file extension.

#### output

```json
jpg
```

### commonFileName

Returns a random file name with a given extension or a commonly used extension.

| Option | Description                                          |
| :----: | ---------------------------------------------------- |
|  ext   | Extension. Empty string is considered to be not set. |

#### Input:

| ext |
| :-: |
| txt |

#### output

```json
global_borders_wyoming.txt
```

### commonFileType

Returns a commonly used file type.

#### output

```json
image
```

### cron

Returns a random cron expression.

#### output

```json
* 14 * * SAT
```

### directoryPath

Returns a directory path.

#### output

```json
/etc/mail
```

### fileExt

Returns a file extension.

#### output

```json
json
```

### fileName

Returns a random file name with extension.

|     Option     | Description                                                                                   |
| :------------: | --------------------------------------------------------------------------------------------- |
| extensionCount | Define how many extensions the file name should have. A negative number will be treated as 0. |

#### Input:

| extensionCount |
| :------------: |
|       2        |

#### output

```json
bike_table.res.vcs
```

### filePath

Returns a file path.

#### output

```json
/root/male_woman.silo
```

### fileType

Returns a file type.

#### output

```json
message
```

### mimeType

mimeType

#### output

```json
application/vnd.patientecommsdoc
```

### networkInterface

Returns a random network interface.

|     Option      | Description                                                |
| :-------------: | ---------------------------------------------------------- |
| interfaceSchema | The interface schema. Can be one of index, slot, mac, pci. |
|  interfaceType  | The interface type. Can be one of en, wl, ww.              |

#### Input:

| interfaceSchema | interfaceType |
| :-------------: | :-----------: |
|       en        |      pci      |

#### output

```json
enp5s0f1d0
```

### semver

Returns a semantic version.

#### output

```json
5.5.7
```
