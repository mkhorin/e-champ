/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Player = require('./Player');

module.exports = class RemotePlayer extends Player {

    constructor (config) {
        super({
            ready: false,
            ...config
        });
    }

    isBot () {
        return false;
    }

    setUser (name, ip) {
        this.name = name;
        this.ip = ip;
        this.ready = true;
    }
};