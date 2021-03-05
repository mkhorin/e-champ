/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/base/BaseController');

module.exports = class DefaultController extends Base {

    actionIndex () {
        const arena = this.module.getArena();
        return this.render('index', {
            games: arena.serializeGames(),
            arena
        });
    }
};
module.exports.init(module);