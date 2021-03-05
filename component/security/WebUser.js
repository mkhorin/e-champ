/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/security/WebUser');

module.exports = class WebUser extends Base {

    static getConstants () {
        return {
            ROOM_SESSION: 'room',
            PLAYER_SESSION: 'player'
        };
    }

    getRoomId () {
        return this.getSession(this.ROOM_SESSION);
    }

    getPlayerId () {
        return this.getSession(this.PLAYER_SESSION);
    }

    setRoomId (id) {
        return this.setSession(this.ROOM_SESSION, id);
    }

    setPlayerId (id) {
        return this.setSession(this.PLAYER_SESSION, id);
    }
};
module.exports.init();