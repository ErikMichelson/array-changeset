/*
 * SPDX-FileCopyrightText: 2025 Erik Michelson <opensource@erik.michelson.eu>
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

  describe('addEventListener', () => {
    it('adds a event listeners for the add event', () => {
      const changeset = new Changeset<number>()
      let item1: number | undefined
      let item2: number | undefined
      changeset.addEventListener('add', (i) => {
        item1 = i
      })
      changeset.addEventListener('add', (i) => {
        item2 = i
      })
      changeset.add(1)
      assert.equal(item1, 1)
      assert.equal(item2, 1)
    })
    it('adds event listeners for the remove event', () => {
      const changeset = new Changeset<number>()
      let item1: number | undefined
      let item2: number | undefined
      changeset.addEventListener('remove', (i) => {
        item1 = i
      })
      changeset.addEventListener('remove', (i) => {
        item2 = i
      })
      changeset.remove(1)
      assert.equal(item1, 1)
      assert.equal(item2, 1)
    })
    it('adds event listeners for the clear event', () => {
      const changeset = new Changeset<number>()
      let cleared1 = false
      let cleared2 = false
      changeset.addEventListener('clear', () => {
        cleared1 = true
      })
      changeset.addEventListener('clear', () => {
        cleared2 = true
      })
      changeset.clear()
      assert.equal(cleared1, true)
      assert.equal(cleared2, true)
    })
    it('throws an error on an invalid event', () => {
      const changeset = new Changeset<number>()
      assert.throws(() => {
        changeset.addEventListener('invalid' as any, () => {})
      }, {
        message: 'Unknown callback event'
      })
    })
  })

  describe('removeEventListener', () => {
    it('successfully removes an event listener for the add event', () => {
      const changeset = new Changeset<number>()
      let item1: number | undefined
      let item2: number | undefined
      const listener1 = (i: number) => {
        item1 = i
      }
      const listener2 = (i: number) => {
        item2 = i
      }
      changeset.addEventListener('add', listener1)
      changeset.addEventListener('add', listener2)
      changeset.removeEventListener('add', listener1)
      changeset.add(1)
      assert.equal(item1, undefined)
      assert.equal(item2, 1)
    })
    it('successfully removes an event listener for the remove event', () => {
      const changeset = new Changeset<number>()
      let item1: number | undefined
      let item2: number | undefined
      const listener1 = (i: number) => {
        item1 = i
      }
      const listener2 = (i: number) => {
        item2 = i
      }
      changeset.addEventListener('remove', listener1)
      changeset.addEventListener('remove', listener2)
      changeset.removeEventListener('remove', listener1)
      changeset.remove(1)
      assert.equal(item1, undefined)
      assert.equal(item2, 1)
    })
    it('successfully removes an event listener for the clear event', () => {
      const changeset = new Changeset<number>()
      let cleared1 = false
      let cleared2 = false
      const listener1 = () => {
        cleared1 = true
      }
      const listener2 = () => {
        cleared2 = true
      }
      changeset.addEventListener('clear', listener1)
      changeset.addEventListener('clear', listener2)
      changeset.removeEventListener('clear', listener1)
      changeset.clear()
      assert.equal(cleared1, false)
      assert.equal(cleared2, true)
    })
    it('throws an error on an invalid event', () => {
      const changeset = new Changeset<number>()
      assert.throws(() => {
        changeset.removeEventListener('invalid' as any, () => {})
      }, {
        message: 'Unknown callback event'
      })
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
