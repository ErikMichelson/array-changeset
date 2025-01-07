/*
 * SPDX-FileCopyrightText: 2025 Erik Michelson <opensource@erik.michelson.eu>
 *
 * SPDX-License-Identifier: MIT
 */
import { describe, it } from 'node:test'
import { exclusiveAddItem } from '../src/utils.js'
import assert from 'node:assert/strict'

const simpleEqualFn = (a: number, b: number) => a === b

describe('exclusiveAddItem', () => {
  it('adds item when both arrays are empty', () => {
    const arrayToAdd: number[] = []
    const arrayToAvoid: number[] = []
    exclusiveAddItem(1, arrayToAdd, arrayToAvoid, simpleEqualFn)
    assert.deepEqual(arrayToAdd, [1])
    assert.deepEqual(arrayToAvoid, [])
  })

  it('removes item from avoid array when added', () => {
    const arrayToAdd: number[] = []
    const arrayToAvoid = [1]
    exclusiveAddItem(1, arrayToAdd, arrayToAvoid, simpleEqualFn)
    assert.deepEqual(arrayToAdd, [])
    assert.deepEqual(arrayToAvoid, [])
  })

  it('removes only one item from avoid array when added', () => {
    const arrayToAdd: number[] = []
    const arrayToAvoid = [1, 1]
    exclusiveAddItem(1, arrayToAdd, arrayToAvoid, simpleEqualFn)
    assert.deepEqual(arrayToAdd, [])
    assert.deepEqual(arrayToAvoid, [1])
  })

  it('does not modify add array when item is in avoid array', () => {
    const arrayToAdd = [1]
    const arrayToAvoid: number[] = [1]
    exclusiveAddItem(1, arrayToAdd, arrayToAvoid, simpleEqualFn)
    assert.deepEqual(arrayToAdd, [1])
    assert.deepEqual(arrayToAvoid, [])
  })

  it('does not add item when uniqueness is enforced and item is already in add array', () => {
    const arrayToAdd = [1]
    const arrayToAvoid: number[] = []
    exclusiveAddItem(1, arrayToAdd, arrayToAvoid, simpleEqualFn, true)
    assert.deepEqual(arrayToAdd, [1])
    assert.deepEqual(arrayToAvoid, [])
  })
})
