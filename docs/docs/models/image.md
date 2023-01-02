---
sidebar_position: 6
tags: [image]
---

# Image

## Module to generate placeholder images.

### avatar

Generates a random avatar image url.

#### output

```json
"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/170.jpg"
```

### fashion

Generates a random fashion image url.
Use imageUrl instead with category `fashion` to customize the width and height of the generated image

Default width and height of image generated from this schema is 640 and 480 respectively.

#### output

```json
"https://loremflickr.com/640/480/fashion"
```

### imageUrl

|  Option  | Default                                    | Description               |
| :------: | ------------------------------------------ | ------------------------- |
|  width   | 640                                        | The width of the image.   |
|  height  | 480                                        | The height of the image.  |
| category | By default, a random one will be selected. | The category of the image |

#### Input:

| width | height | category |
| :---: | :----: | :------: |
| 1234  |  2345  |   cat    |

#### output

```json
"https://loremflickr.com/1234/2345/cat"
```
