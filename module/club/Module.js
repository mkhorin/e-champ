'use strict';

const Base = require('evado/component/base/BaseModule');

module.exports = class ClubModule extends Base {

    constructor (config) {
        super({
            ...config
        });
    }

    getArena () {
        return this.app.getArena();
    }
};
module.exports.init(module);