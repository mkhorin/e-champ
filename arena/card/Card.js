/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const SUITS = Object.freeze([
    'diamonds',
    'hearts',
    'clubs',
    'spades'
]);

const SUIT_COLOR_MAP = Object.freeze({
    diamonds: 'red',
    hearts: 'red',
    clubs: 'black',
    spades: 'black'
});

const COLOR_SUIT_MAP = Object.freeze({
    red: Object.freeze([
        'diamonds',
        'hearts'
    ]),
    black: Object.freeze([
        'clubs',
        'spades'
    ])
});

module.exports = class Card {

    static isSameRank (cards) {
        for (const card of cards) {
            if (card.rank !== cards[0].rank) {
                return false;
            }
        }
        return true;
    }

    static getSuits () {
        return SUITS;
    }

    static getSuitColorMap () {
        return SUIT_COLOR_MAP;
    }

    static getColorSuitMap () {
        return COLOR_SUIT_MAP;
    }

    constructor (rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.faced = false; // was visible to all players
        this.color = SUIT_COLOR_MAP[suit];
        this.data = Object.freeze({rank, suit});
    }

    serialize () {
        return this.data;
    }

    toString () {
        return `${this.rank} ${this.suit}`;
    }
};