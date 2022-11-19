/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Model');

module.exports = class Room extends Base {

    static getConstants () {
        return {
            ATTR_LABELS: {
                name: 'Code name',
                label: 'Game'
            }
        };
    }

    getRoom (name) {
        return this.arena.getRoom(name);
    }

    getListData ({start, length, order, search}) {
        let rooms = this.arena.rooms.values();
        rooms.sort((a, b) => (a.createdAt - b.createdAt) * order.createdAt);
        const maxSize = rooms.length;
        rooms = this.searchRooms(search, rooms);
        const totalSize = rooms.length;
        const items = rooms
            .slice(start, start + length)
            .map(this.getRoomListData, this);
        return {items, maxSize, totalSize};
    }

    searchRooms (search, rooms) {
        if (search) {
            const regex = new RegExp(search, 'i');
            rooms = rooms.filter(({id, game}) => {
                return id === search || regex.test(game.name);
            });
        }
        return rooms;
    }

    getRoomListData (room) {
        return {
            id: room.id,
            name: room.game.name,
            label: room.game.label,
            new: room.isNew(),
            public: room.isPublic(),
            players: room.players.length,
            createdAt: room.createdAt
        };
    }
};
module.exports.init(module);