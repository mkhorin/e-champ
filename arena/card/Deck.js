/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./CardSet');

module.exports = class Deck extends Base {

    createCards (key, decks) {
        if (Array.isArray(decks?.[key])) {
            return this.createByData(decks[key]);
        }
        switch (key) {
            case '36': return this.createCardsByRange(6, 14);
            case '52': return this.createCardsByRange(2, 14);
        }
        throw new Error(`Invalid deck key: ${key}`);
    }

    createCardsByRange (min, max) {
        this.minRank = min;
        this.maxRank = max;
        this.clear();
        for (let rank = min; rank <= max; ++rank) {
            for (const suit of Card.getSuits()) {
                this.add(this.createCard(rank, suit));
            }
        }
    }

    createByData (data) {
        this.minRank = Number.MAX_SAFE_INTEGER;
        this.maxRank = Number.MIN_SAFE_INTEGER;
        this.clear();
        for (const [rank, suit] of data) {
            if (rank < this.minRank) {
                this.minRank = rank;
            }
            if (rank > this.maxRank) {
                this.maxRank = rank;
            }
            this.add(this.createCard(rank, suit));
        }
    }

    createCard () {
        return new Card(...arguments);
    }

    parseCards (items) {
        if (!Array.isArray(items)) {
            return false;
        }
        const result = [];
        for (const item of items) {
            const card = item ? this.find(item.rank, item.suit) : null;
            if (!card) {
                return false;
            }
            result.push(card);
        }
        return result;
    }

    parsePairs (items) {
        if (!Array.isArray(items)) {
            return false;
        }
        const result = [];
        for (const item of items) {
            if (!Array.isArray(item)) {
                return false;
            }
            let [attacking, defending] = item;
            if (!attacking || !defending) {
                return false;
            }
            attacking = this.find(attacking.rank, attacking.suit);
            defending = this.find(defending.rank, defending.suit);
            if (!attacking || !defending) {
                return false;
            }
            result.push([attacking, defending]);
        }
        return result;
    }
};

const Card = require('./Card');