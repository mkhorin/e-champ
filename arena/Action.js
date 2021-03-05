/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Action extends Base {

    hasError () {
        return !!this.error;
    }

    setError (message) {
        this.error = `${this.constructor.name}: ${message}`;
    }

    validate () {
        return !this.hasError();
    }

    validatePlayer () {
        return this.player || this.setError('Player not defined');
    }

    execute () {
        throw new Error('Need to override');
    }
};