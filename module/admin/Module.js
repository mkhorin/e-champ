'use strict';

const Base = require('evado-module-admin/Module');

module.exports = class ChampAdminModule extends Base {

    constructor (config) {
        super({
            original: Base,
            ...config
        });
    }

    getArena () {
        return this.app.getArena();
    }
};
module.exports.init(module);