/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./CardSet');

module.exports = class Hand extends Base {

    constructor (player) {
        super();
        this.player = player;
        this.pos = player.pos;
    }

    isBot () {
        return this.player.isBot();
    }

    getData () {
        return this.player.getData();
    }

    clear () {
        super.clear();
        this.turned = false;
    }

    addWin () {
        return this.player.addWin();
    }

    addLosing () {
        return this.player.addLosing();
    }

    addDraw () {
        return this.player.addDraw();
    }

    serializeFacedCards () {
        const cards = [];
        for (const card of this.cards) {
            if (card.faced) {
                cards.push(card.data);
            }
        }
        return [this.count(), cards];
    }
};