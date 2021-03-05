/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Bot extends Base {

    createSolver (params) {
        return new this.solver.Class({...this.solver, ...params});
    }

    serialize () {
        return {
            name: this.name,
            label: this.label,
            translations: this.translations
        };
    }

    translateLabel () {
        return this.translate('label', ...arguments) || this.label;
    }

    translate (key, language) {
        return this.translations?.[language]?.[key];
    }
};