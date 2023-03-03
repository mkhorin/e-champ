/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Room extends Base {

    static createId () {
        return SecurityHelper.getRandomString(8);
    }

    constructor (config) {
        super({
            public: true,
            ...config
        });
        this.arena = this.game.arena;
        this.createdAt = new Date;
        this.id = this.constructor.createId();
        this.createPlayers(this.players);
    }

    isNew () {
        return !this.play;
    }

    isPublic () {
        return this.public;
    }

    isPublicNew () {
        return this.public && !this.play;
    }

    isPlay () {
        return !!this.play;
    }

    canStart () {
        return this.isNew() && !this.getFreePlayer();
    }

    start () {
        if (this.canStart()) {
            this.play = this.createPlay();
            this.play.start();
            return true;
        }
    }

    clearPlay () {
        for (const player of this.players) {
            player.clear();
        }
        this.play?.clear();
    }

    remove () {
        return this.arena.removeRoom(this);
    }

    getPlayer (id) {
        return this.playerMap.hasOwnProperty(id) ? this.playerMap[id] : null;
    }

    getFreePlayer () {
        for (const player of this.players) {
            if (player.isFree()) {
                return player;
            }
        }
    }

    createPlayers (items) {
        this.players = [];
        this.playerMap = {};
        items.forEach((item, index) => {
            const player = this.createPlayer(item, index);
            this.players.push(player);
            this.playerMap[player.id] = player;
        });
        this.creator = this.players[0];
    }

    createPlayer (data, pos) {
        const config = {...this.game.players[data.type], ...data, pos};
        config.room = this;
        return ClassHelper.spawn(config);
    }

    createPlay () {
        return ClassHelper.spawn({...this.game.play, room: this});
    }

    broadcast (getter) {
        this.arena.handleRoomSockets(this, socket => socket.send(getter(socket.player)));
    }

    broadcastCommonData (data) {
        data = JSON.stringify(data);
        this.arena.handleRoomSockets(this, socket => socket.sendText(data));
    }

    broadcastError (message) {
        this.arena.handleRoomSockets(this, socket => socket.sendError(message));
    }

    onRemoteMessage (data, socket) {
        if (this.play) {
            return this.play.onRemoteMessage(data, socket);
        }
        const gathering = this.getGatheringData();
        socket.send(gathering);
    }

    getGatheringData () {
        const players = this.players.map(this.getPlayerGatheringData, this);
        return {
            room: this.id,
            name: this.game.name,
            label: this.game.label,
            public: this.public,
            options: this.options,
            players
        };
    }

    getPlayerGatheringData (player) {
        return {
            ready: player.ready,
            type: player.type,
            name: player.name
        };
    }

    log () {
        this.arena.log(...arguments);
    }
};

const ClassHelper = require('areto/helper/ClassHelper');
const SecurityHelper = require('areto/helper/SecurityHelper');