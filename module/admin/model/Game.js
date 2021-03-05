/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Model');

module.exports = class Game extends Base {

    static getConstants () {
        return {
            ATTR_LABELS: {
                name: 'Code name'
            }
        };
    }

    getGame (name) {
        return this.arena.getGame(name);
    }

    getListData ({start, length}) {
        const games = this.arena.games.values();
        const maxSize = games.length;
        const totalSize = games.length;
        const items = games.slice(start, start + length).map(this.getGameListData, this);
        return {items, maxSize, totalSize};
    }

    getGameListData (game) {
        return game.serialize();
    }
};
module.exports.init(module);