/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/Application');

module.exports = class ChampApplication extends Base {

    constructor (config) {
        super({
            original: Base,
            ...config
        });
    }

    getArena () {
        return this.components.get('arena');
    }
};
module.exports.init(module);