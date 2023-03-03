/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = class Event {

    constructor (name, data) {
        this.name = name;
        this.data = data;
        this.timestamp = Date.now();
    }

    match ({name, data}) {
        return name === this.name
            && JSON.stringify(data) === JSON.stringify(this.data);
    }

    serializeForPlayer () {
        return this.serialize();
    }

    serialize () {
        return [this.name, this.data];
    }
};