'use strict';

const Base = require('areto/base/Model');

module.exports = class Join extends Base {

    static getConstants () {
        return {
            RULES: [
                [['name', 'room'], 'required'],
                ['name', 'validator/UserNameValidator'],
                ['room', 'validateRoom'],
                ['player', 'validatePlayer', {skipOnAnyError: true}]
            ]
        };
    }

    isBusyName (player) {
        const name = this.get('name').toLowerCase();
        for (const opponent of this.room.players) {
            if (opponent !== player) {
                if (opponent.name?.toLowerCase() === name) {
                    this.addError('name', 'This name is already taken');
                    return true;
                }
            }
        }
        return false;
    }

    validateRoom (attr) {
        this.room = this.module.getArena().getRoom(this.get(attr));
        if (!this.room) {
            return this.addError(attr, 'Room not found');
        }
        if (this.room.play) {
            return this.addError(attr, 'Gathering this room is already over');
        }
    }

    validatePlayer (attr) {
        this.player = this.room.getPlayer(this.get(attr));
    }
};
module.exports.init(module);