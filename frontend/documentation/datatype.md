## Datatype
### Module to generate various primitive values and data types.

### array

Returns an array with random strings and numbers.


|Option| Description|
|:-------:|-----|
|length | Size of the returned array. |
#### Input:
|length |
|:-------:|
|  3    |

#### Output:
[ 61845, 'SK7H$W3:d*', 'm[%7N8*GVK' ]

### bigInt
Returns a BigInt number.
|Option|Description|
|:----:|----|
|min|Lower bound for generated bigint|
|max|Upper bound for generated bigint|
#### Input:
|min|max|
|:----:|:----:|
|11111111|1111111111|
#### Output:
524872478
### boolean
Returns the boolean value true or false.
#### Output:
true
### datetime
Returns a Date object using a random number of milliseconds since the Unix Epoch (1 January 1970 UTC).

|Option|Description| Default|
|:----:|----|----|
|min|Upper bound for milliseconds since base date. When not provided or larger than 8640000000000000, 2100-01-01 is considered as maximum generated date.|631152000000|
|max|Lower bound for milliseconds since base date. When not provided or smaller than -8640000000000000, 1990-01-01 is considered as minimum generated date.| 4102444800000|
#### Input:
|min|max|
|:----:|:----:|
|1577836800000|1893456000000|
#### Output:
'2021-09-12T07:13:00.255Z'
### float
Returns a single random floating-point number for the given precision or range and precision.
|Option|Description|
|:----:|----|
|min|Lower bound for generated number.|
|max|Upper bound for generated number.|
|precision|Precision of the generated number.|
#### Input:
|min|max|precision|
|:----:|:----:|:----:|
|10|100|0.001|
#### Output:
57.315
### hexadecimal
Returns a hexadecimal number.
|Option|Description|
|:----:|----|
|length|Length of the generated number.|
|case|Case of the generated number.|
|prefix|Prefix for the generated number.|
#### Input:
|length|case|prefix|
|:----:|:----:|:----:|
|10|mixed|0x|
#### Output:
0xAdE330a4D1
### json
Returns a string representing JSON object with 7 pre-defined properties.
#### Output:
{"foo":"mxz.v8ISij","bar":29154,"bike":8658,"a":"GxTlw$nuC:","b":40693,"name":"%'<FTou{7X","prop":"X(bd4iT>77"}
### number
Returns a single random number between zero and the given max value or the given range with the specified precision. The bounds are inclusive.
|Option|Description|
|:----:|----|
|min|Lower bound for generated number.|
|max|Upper bound for generated number.|
|precision|Precision of the generated number.|
#### Input:
|min|max|precision|
|:----:|:----:|:----:|
|10|100|0.01|
#### Output:
36.94
### string
Returns a string containing UTF-16 chars between 33 and 125 (! to }).
|Option|Description|
|:----:|----|
|length|Length of the generated string. Max length is 2^20.|
#### Input:
|length|
|:----:|
|5||
#### Output:
6Bye8
### uuid
Returns a UUID v4
#### Output:
4136cd0b-d90b-4af7-b485-5d1ded8db252
