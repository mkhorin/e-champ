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

    getLast () {
        return this.events[this.events.length - 1];
    }

    add (name, data) {
        const {Class} = this.play.game.getEventConfig(name);
        const event = new Class(name, data);
        this.events.push(event);
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
            const data = this.events[i].serializeForPlayer(player);
            result.push(data);
        }
        return result;
    }

    serializeAll () {
        const result = [];
        for (const event of this.events) {
            const data = event.serialize();
            result.push(data);
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