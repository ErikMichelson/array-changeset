<!--
SPDX-FileCopyrightText: 2025 Erik Michelson <opensource@erik.michelson.eu>

SPDX-License-Identifier: MIT
-->

# array-changeset

[![NPM Version](https://img.shields.io/npm/v/array-changeset)](https://www.npmjs.com/package/array-changeset)
[![Coverage Status](https://coveralls.io/repos/github/ErikMichelson/array-changeset/badge.svg?branch=main)](https://coveralls.io/github/ErikMichelson/array-changeset?branch=main)
[![Checks](https://github.com/ErikMichelson/array-changeset/actions/workflows/check.yml/badge.svg)](https://github.com/ErikMichelson/array-changeset/actions/workflows/check.yml)
[![Tests](https://github.com/ErikMichelson/array-changeset/actions/workflows/test.yml/badge.svg)](https://github.com/ErikMichelson/array-changeset/actions/workflows/test.yml)

This tiny library can be used to calculate the changeset between two arrays and applying these changes to another array.

The library is **ESM-only**. See [this note by sindresorhus][esm-note] to learn more about that.

## Installation

### Using npm

```shell
npm install array-changeset
```

### In browser

```html
<script type="module">
import { Changeset } from "https://cdn.jsdelivr.net/npm/array-changeset@1/+esm";

// your code using Changeset
</script>
```

## Usage

```javascript
import { Changeset } from 'array-changeset'

const arrayA = ['foo', '!']
const arrayB = ['foo', 'bar']

// Use fromDiff to create a changeset from the difference between two arrays
const changeset = Changeset.fromDiff(arrayA, arrayB)

// Check if there are any changes from arrayA to arrayB
console.log(changeset.hasChanges()) // true

// Access the added and removed elements
console.log(changeset.getAdded()) // ['bar']
console.log(changeset.getRemoved()) // ['!']

// Add an event listener for logging additions
const logAddition = (item) => console.log(`Added: ${item}`)
changeset.addEventListener('add', logAddition) // Other events are: remove, clear

// Modify the changeset (arrayA and arrayB are not modified)
changeset.add('!') // this triggers the event listener
changeset.remove('bar')
changeset.remove('more')
changeset.uniquelyAddItem('unique') // This triggers the event listener as well
changeset.uniquelyAddItem('unique', (a, b) => a === b) // The comparator is optional and defaults to fast-deep-equal

console.log(changeset.getAdded()) // ['unique']
console.log(changeset.getRemoved()) // ['more']

// Remove the event listener again
changeset.removeEventListener('add', logAddition)

// Apply the changeset to another array (without modifying arrayC)
const arrayC = ['much', 'more', 'foo', '!']
const modifiedC = changeset.applyOnto(arrayC)
console.log(modifiedC) // ['much', 'foo', '!', 'unique']

// Clear the changeset
changeset.clear()

console.log(changeset.hasChanges()) // false
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

[esm-note]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
