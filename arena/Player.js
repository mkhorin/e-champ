/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Player extends Base {

    static createId () {
        return SecurityHelper.getRandomString(8);
    }

    constructor (config) {
        super({
            won: 0,
            lost: 0,
            drawn: 0,
            ...config
        });
        this.id = this.constructor.createId();
    }

    isFree () {
        return !this.ready;
    }

    addWin () {
        return ++this.won;
    }

    addLosing () {
        return ++this.lost;
    }

    addDraw () {
        return ++this.drawn;
    }

    getData () {
        return {
            name: this.name,
            type: this.type,
            won: this.won,
            lost: this.lost,
            drawn: this.drawn
        };
    }

    clear () {}

    log () {
        CommonHelper.log(this.room, this.constructor.name, ...arguments);
    }
};

const CommonHelper = require('areto/helper/CommonHelper');
const SecurityHelper = require('areto/helper/SecurityHelper');