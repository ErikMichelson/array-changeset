/*
 * SPDX-FileCopyrightText: 2024 Erik Michelson <opensource@erik.michelson.eu>
 *
 * SPDX-License-Identifier: MIT
 */
import { describe, it } from 'node:test'
import { Changeset } from '../src/changeset.js'
import assert from 'node:assert/strict'

describe('Changeset', () => {
  describe('hasChanges', () => {
    it('returns false if no changes have been made', () => {
      const changeset = new Changeset()
      assert.equal(changeset.hasChanges(), false)
    })
    it('returns true if changes exist (1)', () => {
      const changeset = new Changeset([1], [])
      assert.equal(changeset.hasChanges(), true)
    })
    it('returns true if changes exist (2)', () => {
      const changeset = new Changeset([], [1])
      assert.equal(changeset.hasChanges(), true)
    })
  })

  describe('add', () => {
    it('adds an item to the added list (1)', () => {
      const changeset = new Changeset()
      changeset.add(1)
      assert.deepEqual(changeset.getAdded(), [1])
      assert.deepEqual(changeset.getRemoved(), [])
    })
    it('adds an item to the added list (2)', () => {
      const changeset = new Changeset([0], [])
      changeset.add(1)
      assert.deepEqual(changeset.getAdded(), [0, 1])
      assert.deepEqual(changeset.getRemoved(), [])
    })
    it('removes an item from the removed list', () => {
      const changeset = new Changeset([], [1])
      changeset.add(1)
      assert.deepEqual(changeset.getAdded(), [])
      assert.deepEqual(changeset.getRemoved(), [])
    })
  })

  describe('remove', () => {
    it('adds an item to the removed list (1)', () => {
      const changeset = new Changeset()
      changeset.remove(1)
      assert.deepEqual(changeset.getAdded(), [])
      assert.deepEqual(changeset.getRemoved(), [1])
    })
    it('adds an item to the removed list (2)', () => {
      const changeset = new Changeset([], [0])
      changeset.remove(1)
      assert.deepEqual(changeset.getAdded(), [])
      assert.deepEqual(changeset.getRemoved(), [0, 1])
    })
    it('removes an item from the added list', () => {
      const changeset = new Changeset([1], [])
      changeset.remove(1)
      assert.deepEqual(changeset.getAdded(), [])
      assert.deepEqual(changeset.getRemoved(), [])
    })
  })

  describe('uniquelyAddItem', () => {
    it('adds an item to the added list if not already present', () => {
      const changeset = new Changeset([0], [])
      changeset.uniquelyAddItem(1)
      assert.deepEqual(changeset.getAdded(), [0, 1])
      assert.deepEqual(changeset.getRemoved(), [])
    })
    it('does not add an item to the added list if already present', () => {
      const changeset = new Changeset([0], [])
      changeset.uniquelyAddItem(0)
      assert.deepEqual(changeset.getAdded(), [0])
      assert.deepEqual(changeset.getRemoved(), [])
    })
    it('removes an item from the removed list', () => {
      const changeset = new Changeset([], [1])
      changeset.uniquelyAddItem(1)
      assert.deepEqual(changeset.getAdded(), [])
      assert.deepEqual(changeset.getRemoved(), [])
    })
  })

  describe('clear', () => {
    it('clears the added and removed lists', () => {
      const changeset = new Changeset([1], [2])
      changeset.clear()
      assert.deepEqual(changeset.getAdded(), [])
      assert.deepEqual(changeset.getRemoved(), [])
    })
  })

  describe('applyOnto', () => {
    it('returns the original list if no changes have been made', () => {
      const changeset = new Changeset()
      assert.deepEqual(changeset.applyOnto([1, 2, 3]), [1, 2, 3])
    })
    it('returns the modified list if an empty original list is provided', () => {
      const changeset = new Changeset([4, 5], [1, 2, 3])
      assert.deepEqual(changeset.applyOnto([]), [4, 5])
    })
    it('returns original list and added list combined if removed list is empty', () => {
      const changeset = new Changeset([4, 5], [])
      assert.deepEqual(changeset.applyOnto([1, 2, 3]), [1, 2, 3, 4, 5])
    })
    it('applies the changes onto the original list', () => {
      const changeset = new Changeset([4, 5], [1, 2])
      assert.deepEqual(changeset.applyOnto([1, 2, 3]), [3, 4, 5])
    })
  })

  describe('fromDiff', () => {
    it('returns an empty changeset if the original and modified lists are equal', () => {
      const changeset = Changeset.fromDiff([1, 2, 3], [1, 2, 3])
      assert.deepEqual(changeset.getAdded(), [])
      assert.deepEqual(changeset.getRemoved(), [])
    })
    it('returns a changeset with added items', () => {
      const changeset = Changeset.fromDiff([], [1, 2])
      assert.deepEqual(changeset.getAdded(), [1, 2])
      assert.deepEqual(changeset.getRemoved(), [])
    })
    it('returns a changeset with removed items', () => {
      const changeset = Changeset.fromDiff([1, 2], [])
      assert.deepEqual(changeset.getAdded(), [])
      assert.deepEqual(changeset.getRemoved(), [1, 2])
    })
    it('returns a changeset with added and removed items', () => {
      const changeset = Changeset.fromDiff([1, 2, 3], [2, 3, 4])
      assert.deepEqual(changeset.getAdded(), [4])
      assert.deepEqual(changeset.getRemoved(), [1])
    })
  })
})
