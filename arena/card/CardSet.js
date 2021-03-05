/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = class CardSet {

    constructor () {
        this.clear();
    }

    isEmpty () {
        return !this.cards.length;
    }

    has (card) {
        return this.cards.includes(card);
    }

    hasRank (rank) {
        for (const card of this.cards) {
            if (card.rank === rank) {
                return true;
            }
        }
    }

    count () {
        return this.cards.length;
    }

    get (index) {
        return this.cards[index];
    }

    find (rank, suit) {
        for (const card of this.cards) {
            if (card.rank === rank && card.suit === suit) {
                return card;
            }
        }
    }

    add (data) {
        if (data instanceof CardSet) {
            this.cards.push(...data.cards);
        } else if (Array.isArray(data)) {
            this.cards.push(...data);
        } else if (data) {
            this.cards.push(data);
        }
    }

    clear () {
        this.cards = [];
    }

    remove (card) {
        const index = this.cards.indexOf(card);
        if (index !== -1) {
            return this.cards.splice(index, 1);
        }
    }

    splice () {
        return this.cards.splice.apply(this.cards, arguments);
    }

    forEach () {
        return this.cards.forEach(...arguments);
    }

    map () {
        return this.cards.map(...arguments);
    }

    shuffle () {
        ArrayHelper.shuffle(this.cards);
    }

    serialize () {
        const cards = [];
        for (const card of this.cards) {
            cards.push(card.data);
        }
        return cards;
    }

    [Symbol.iterator] () {
        return this.cards[Symbol.iterator]();
    }

    getLowestBySuit (suit) {
        let lowestCard = null;
        let lowestRank = Number.MAX_SAFE_INTEGER;
        for (const card of this.cards) {
            if (card.suit === suit && card.rank < lowestRank) {
                lowestCard = card;
                lowestRank = card.rank;
            }
        }
        return lowestCard;
    }

    getLowest () {
        let lowestCard = null;
        let lowestRank = Number.MAX_SAFE_INTEGER;
        for (const card of this.cards) {
            if (card.rank < lowestRank) {
                lowestCard = card;
                lowestRank = card.rank;
            }
        }
        return lowestCard;
    }
};

const ArrayHelper = require('areto/helper/ArrayHelper');