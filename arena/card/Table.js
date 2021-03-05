/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = class Table {

    constructor () {
        this.clear();
    }

    isEmpty () {
        return !this.pairs.length;
    }

    isSameRank ({rank}) {
        for (const [attacking, defending] of this.pairs) {
            if (attacking.rank === rank || defending?.rank === rank) {
                return true;
            }
        }
        return false;
    }

    isSameAttackingRank ({rank}) {
        for (const [attacking] of this.pairs) {
            if (attacking.rank === rank) {
                return true;
            }
        }
        return false;
    }

    hasOpenAttack () {
        for (const pair of this.pairs) {
            if (!pair[1]) {
                return true;
            }
        }
        return false;
    }

    hasAnyDefense () {
        for (const pair of this.pairs) {
            if (pair[1]) {
                return true;
            }
        }
        return false;
    }

    hasOnlyFullRanks () {
        if (this.pairs.length !== 4) {
            return false;
        }
        const attackingRank = this.pairs[0][0].rank;
        const defendingRank = this.pairs[0][1]?.rank;
        for (let i = 1; i < this.pairs.length; ++i) {
            const pair = this.pairs[i];
            if (pair[0].rank !== attackingRank) {
                return false;
            }
            if (defendingRank ? pair[1]?.rank !== defendingRank : pair[1]) {
                return false;
            }
        }
        return true;
    }

    getCards () {
        const cards = [];
        for (const [attacking, defending] of this.pairs) {
            cards.push(attacking);
            if (defending) {
                cards.push(defending);
            }
        }
        return cards;
    }

    getOpenAttacks () {
        const result = [];
        for (const [attacking, defending] of this.pairs) {
            if (!defending) {
                result.push(attacking);
            }
        }
        return result;
    }

    getPairByAttacking (card) {
        for (const pair of this.pairs) {
            if (card === pair[0]) {
                return pair;
            }
        }
    }

    countAttacks () {
        return this.pairs.length;
    }

    countOpenAttacks () {
        let counter = 0;
        for (const pair of this.pairs) {
            if (!pair[1]) {
                ++counter;
            }
        }
        return counter;
    }

    clear () {
        this.pairs = [];
    }

    attack (card) {
        this.pairs.push([card]);
        card.faced = true;
    }

    serialize () {
        return this.pairs.map(p => p[1] ? [p[0].data, p[1].data] : [p[0].data]);
    }
};