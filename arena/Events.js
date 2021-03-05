/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Events extends Base {

    constructor (config) {
        super(config);
        this.clear();
    }

    hasNew () {
        return this.events.length > this.cursor;
    }

    getLastTimestamp () {
        return this.events[this.events.length - 1]?.timestamp;
    }

    add (name, data) {
        const {Class} = this.play.game.getEventConfig(name);
        this.events.push(new Class(name, data));
    }

    removeFrom (start) {
        this.events.splice(start, this.events.length);
        this.setCursorToEnd();
    }

    clear () {
        this.cursor = 0;
        this.events = [];
    }

    count () {
        return this.events.length;
    }

    serializeForPlayer (player, cursor = this.cursor) {
        const result = [];
        for (let i = cursor; i < this.events.length; ++i) {
            result.push(this.events[i].serializeForPlayer(player));
        }
        return result;
    }

    serializeAll () {
        const result = [];
        for (const event of this.events) {
            result.push(event.serialize());
        }
        return result;
    }

    setCursor (cursor) {
        this.cursor = cursor;
    }

    setCursorToEnd () {
        this.cursor = this.events.length;
    }
};