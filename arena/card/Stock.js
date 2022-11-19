/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./CardSet');

module.exports = class Stock extends Base {

    getDealCards (num) {
        const counter = this.count();
        if (counter <= num) {
            num = counter;
        }
        return this.splice(-num, num).reverse();
    }

    shuffle ({maxOneColorSequence: max} = {}) {
        super.shuffle();
        if (max && this.checkOneColorSequence(max)) {
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