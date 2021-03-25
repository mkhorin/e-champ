/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Component');

module.exports = class Arena extends Base {

    constructor (config) {
        super({
            defaultGame: {
                Class: require('./Game')
            },
            ...config
        });
        this.rooms = new DataMap;
        this.app = this.module.app;
        this.app.on(this.app.EVENT_AFTER_START, this.onStartServer.bind(this));
    }

    init () {
        this.createGames(this.games);
        this.attachStaticSources();
    }

    getGame () {
        return this.games.get(...arguments);
    }

    createGames (data) {
        this.games = new DataMap;
        for (const name of Object.keys(data)) {
            const game = this.createGame(name, data[name]);
            if (game) {
                this.games.set(name, game);
            }
        }
    }

    createGame (name, data) {
        if (data) {
            return ClassHelper.spawn({...this.defaultGame, ...data, name, arena: this});
        }
    }

    attachStaticSources () {
        for (const game of this.games) {
            game.attachStaticSources();
        }
    }

    attachStaticDirectory () {
        this.module.attachStaticDirectory(...arguments);
    }

    serializeGames () {
        return this.games.map(game => game.serialize());
    }

    getRoom () {
        return this.rooms.get(...arguments);
    }

    createRoom (data) {
        const room = data.game.createRoom(data);
        this.rooms.set(room.id, room);
        return room;
    }

    removeRoom (room) {
        room.clearPlay();
        this.removeRoomSockets(room);
        this.rooms.unset(room.id);
    }

    onStartServer () {
        this.createSocketServer();
    }

    createSocketServer () {
        this.socketServer = new ws.Server({
            server: this.app.server,
            path: this.socketPath
        });
        this.sockets = [];
        this.socketServer.on('connection', this.onConnectSocket.bind(this));
    }

    onConnectSocket (socket) {
        socket = this.spawn(this.socket, {socket, arena: this});
        this.sockets.push(socket);
    }

    handleRoomSockets (room, handler) {
        for (const socket of this.sockets) {
            if (socket.room === room) {
                handler(socket);
            }
        }
    }

    removeRoomSockets (room) {
        for (const socket of Array.from(this.sockets)) {
            if (socket.room === room) {
                this.removeSocket(socket);
            }
        }
    }

    removeSocket (socket) {
        ArrayHelper.remove(socket, this.sockets);
        socket.close('Socket removed');
    }
};
module.exports.init(module);

const ArrayHelper = require('areto/helper/ArrayHelper');
const ClassHelper = require('areto/helper/ClassHelper');
const DataMap = require('areto/base/DataMap');
const ws = require('ws');