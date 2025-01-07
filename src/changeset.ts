/*
 * SPDX-FileCopyrightText: 2025 Erik Michelson <opensource@erik.michelson.eu>
 *
 * SPDX-License-Identifier: MIT
 */
import equal from 'fast-deep-equal';
import { exclusiveAddItem } from './utils.js';

/**
 * A Changeset is a list of added and removed items from or to a list of items.
 * It can be used to keep track of changes of one list and apply them to another.
 * The changeset does not store or modify the original list.
 */
export class Changeset<T> {
  private added: T[] = [];
  private removed: T[] = [];

  /**
   * Creates a new Changeset.
   *
   * @param added Optional initializer of added items
   * @param removed Optional initializer of removed items
   */
  constructor(added: T[] = [], removed: T[] = []) {
    this.added = added;
    this.removed = removed;
  }

  /**
   * Returns true if the changeset contains any changes
   */
  hasChanges(): boolean {
    return this.added.length > 0 || this.removed.length > 0;
  }

  /**
   * Adds an item to the added list.
   *
   * @param item The item to add
   * @param equalFn Optional function to compare items
   */
  add(item: T, equalFn = equal): void {
    exclusiveAddItem(item, this.added, this.removed, equalFn);
  }

  /**
   * Adds an item to the removed list.
   *
   * @param item The item to remove
   * @param equalFn Optional function to compare items
   */
  remove(item: T, equalFn = equal): void {
    exclusiveAddItem(item, this.removed, this.added, equalFn);
  }

  /**
   * Adds an item to the added list, enforcing uniqueness of items in the added list.
   *
   * @param item The item to add
   * @param equalFn Optional function to compare items
   */
  uniquelyAddItem(item: T, equalFn = equal): void {
    exclusiveAddItem(item, this.added, this.removed, equalFn, true);
  }

  /**
   * Clears the changeset.
   */
  clear(): void {
    this.added = [];
    this.removed = [];
  }

  /**
   * Returns the added items.
   */
  getAdded(): T[] {
    return this.added;
  }

  /**
   * Returns the removed items.
   */
  getRemoved(): T[] {
    return this.removed;
  }

  /**
   * Applies the changeset to another list and returns the modified list.
   * The original list is not modified.
   *
   * @param original The original list to apply the changeset to
   * @param equalFn Optional function to compare items
   * @return The modified list
   */
  applyOnto(original: T[], equalFn = equal): T[] {
    if (!this.hasChanges()) {
      return original;
    }
    if (original.length === 0) {
      return this.added;
    }
    if (this.removed.length === 0) {
      return [...original, ...this.added];
    }
    const withoutRemovedEntries = original.filter(
      (originalItem) =>
        !this.removed.some((removedItem) => equalFn(removedItem, originalItem))
    );
    return [...withoutRemovedEntries, ...this.added];
  }

  /**
   * Returns a changeset from the difference of two lists.
   *
   * @param original The original list
   * @param modified The modified list
   * @param equalFn Optional function to compare items
   * @return The changeset
   */
  static fromDiff<T>(
    original: T[],
    modified: T[],
    equalFn = equal
  ): Changeset<T> {
    if (equalFn(original, modified)) {
      return new Changeset();
    }
    const added = modified.filter(
      (modifiedItem) =>
        !original.some((originalItem) => equalFn(modifiedItem, originalItem))
    );
    const removed = original.filter(
      (originalItem) =>
        !modified.some((modifiedItem) => equalFn(modifiedItem, originalItem))
    );
    return new Changeset<T>(added, removed);
  }
}
