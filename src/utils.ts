/*
 * SPDX-FileCopyrightText: 2024 Erik Michelson <opensource@erik.michelson.eu>
 *
 * SPDX-License-Identifier: MIT
 */
export const exclusiveAddItem = <T>(
  item: T,
  arrayToAdd: T[],
  arrayToAvoid: T[],
  equalFn: (a: T, b: T) => boolean,
  unique = false
): void => {
  const indexInArrayToAvoid = arrayToAvoid.findIndex((arrayItem) =>
    equalFn(item, arrayItem)
  )
  if (indexInArrayToAvoid >= 0) {
    arrayToAvoid.splice(indexInArrayToAvoid, 1)
    return
  }
  if (unique) {
    const indexInArrayToAdd = arrayToAdd.findIndex((arrayItem) =>
      equalFn(item, arrayItem)
    )
    if (indexInArrayToAdd >= 0) {
      return
    }
  }
  arrayToAdd.push(item)
}
