/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Socket extends Base {

    constructor (config) {
        super(config);
        this.socket.addEventListener('message', this.onMessage.bind(this));
        this.socket.addEventListener('close', this.onClose.bind(this));
        this.socket.addEventListener('error', this.onError.bind(this));
    }

    send (data) {
        this.sendText(JSON.stringify(data));
    }

    sendError (error) {
        this.send({error});
    }

    sendText (data) {
        this.socket.send(data);
    }

    async onMessage ({data}) {
        try {
            data = CommonHelper.parseJson(data);
            this.room = this.arena.getRoom(data?.room);
            if (!this.room) {
                return this.sendError('Room not found. Create a new one or join');
            }
            this.player = this.room.getPlayer(data.player);
            await this.room.onRemoteMessage(data, this);
        } catch (err) {
            this.log('error', err);
        }
    }

    onClose () {
        try {
            this.remove();
        } catch (err) {
            this.log('error', err);
        }
    }

    onError () {
        try {
            this.remove();
        } catch (err) {
            this.log('error', err);
        }
    }

    close () {
        this.socket.close();
    }

    remove () {
        this.arena.removeSocket(this);
    }

    log () {
        CommonHelper.log(this.arena, this.constructor.name, ...arguments);
    }
};

const CommonHelper = require('areto/helper/CommonHelper');