/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Play extends Base {

    constructor (config) {
        super(config);
        this.game = this.room.game;
        this.options = this.room.options;
        this.round = 0;
        this.finished = true;
        this.events = this.createEvents();
    }

    isFinished () {
        return this.finished;
    }

    clear () {
    }

    start () {
    }

    getLastTimestamp () {
        return this.events.getLast()?.timestamp;
    }

    addEvent () {
        return this.events.add(...arguments);
    }

    createEvents () {
        return this.spawn({Class: Events}, {play: this});
    }

    async onBotMessage (data, player) {
        if (this.isFinished()) {
            return false;
        }
        const error = await this.executeAction(data, player);
        if (error) {
            this.room.broadcastError(`Bot ${player.name}: ${error}`);
        }
    }

    async onRemoteMessage (data, socket) {
        if (this.error) {
            return socket.sendError(this.error);
        }
        if (!data.action) {
            return this.sendStartData(socket);
        }
        if (this.getLastTimestamp() !== data.timestamp) {
            return socket.send(this.getDataToSend(socket.player)); // actualize player
        }
        const error = await this.executeAction(data, socket.player);
        if (error) {
            socket.sendError(error);
        }
    }

    sendStartData (socket) {
        socket.send(this.getDataToSend(socket.player, 0));
    }

    async executeAction (data, player) {
        if (!this.game.hasAction(data.action)) {
            return `Action not found: ${data.action}`;
        }
        const action = this.createAction(data.action, data, player);
        if (!action.validate()) {
            return action.error;
        }
        await action.execute();
        this.update();
    }

    createAction (name, data, player) {
        const config = this.game.actions[name];
        config.data = data;
        config.play = this;
        config.player = player;
        return new config.Class(config);
    }

    getDataToSend (player, cursor) {
        return {
            play: true,
            room: this.room.id,
            player: player?.id,
            pos: player?.pos,
            events: this.events.serializeForPlayer(player, cursor),
            timestamp: this.getLastTimestamp()
        };
    }

    startNextRound () {
        this.round += 1;
        this.startRound();
    }

    setError (message) {
        this.finished = true;
        this.error = message;
        this.room.broadcastError(message);
    }

    serialize () {
        return {
            game: this.game.name,
            events: this.events.serializeAll()
        };
    }

    update () {
        if (this.events.hasNew()) {
            this.room.broadcast(player => this.getDataToSend(player));
            this.events.setCursorToEnd();
            this.updateBots();
        }
    }

    updateBots () {
    }

    log () {
        CommonHelper.log(this.room, this.constructor.name, ...arguments);
    }
};

const CommonHelper = require('areto/helper/CommonHelper');
const Events = require('./Events');