/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./CardSet');

module.exports = class Stock extends Base {

    getDealCards (num) {
        num = this.count() > num ? num : this.count();
        return this.splice(-num, num).reverse();
    }

    shuffle ({maxOneColorSequence} = {}) {
        super.shuffle();
        if (maxOneColorSequence && this.checkOneColorSequence(maxOneColorSequence)) {
            this.shuffle();
        }
    }

    checkOneColorSequence (max) {
        let color = null;
        let counter = 0;
        for (let card of this) {
            if (card.color !== color) {
                color = card.color;
                counter = 1;
                continue;
            }
            counter += 1;
            if (counter > max) {
                return true;
            }
        }
    }
};