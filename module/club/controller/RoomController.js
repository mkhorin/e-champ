/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/base/BaseController');

module.exports = class RoomController extends Base {

    async actionCreate () {
        const ip = this.user.getIp();
        const model = this.spawn('model/Room', {ip});
        model.setSafeAttrs(this.getPostParams());
        if (!await model.validate()) {
            return this.sendModelErrors(model);
        }
        const arena = this.module.getArena();
        const room = arena.createRoom(model.getRoomData());
        if (!room) {
            throw new BadRequest('Room creation failed');
        }
        room.start();
        this.sendJson({
            room: room.id,
            player: room.creator.id
        });
    }

    actionList () {
        const arena = this.module.getArena();
        const result = [];
        for (const room of arena.rooms) {
            if (room.isPublicNew()) {
                const data = room.getGatheringData();
                result.push(data);
            }
        }
        this.sendJson(result);
    }

    async actionJoin () {
        const ip = this.user.getIp();
        const model = this.spawn('model/Join', {ip});
        model.setSafeAttrs(this.getPostParams());
        if (!await model.validate()) {
            return this.sendModelErrors(model);
        }
        const {room} = model;
        const player = model.player || room.getFreePlayer();
        if (!player) {
            throw new BadRequest('All players are already taken');
        }
        if (model.isBusyName(player)) {
            return this.sendModelErrors(model);
        }
        player.setUser(model.get('name'), ip);
        if (!room.start()) {
            const data = room.getGatheringData();
            room.broadcastCommonData(data);
        }
        this.sendJson({
            room: room.id,
            player: player.id
        });
    }

    actionPlay () {
        const room = this.getRoom();
        const {game} = room;
        const template = game.getTemplate('play', this);
        return this.render(template, {room, game});
    }

    actionDownload () {
        const room = this.getRoom();
        const {play} = room;
        if (!play) {
            throw new BadRequest('Room has not started playing yet');
        }
        if (!play.isFinished()) {
            throw new BadRequest('Room is still playing');
        }
        const data = play.serialize();
        this.sendJson(data);
    }

    actionPlayback () {
        const {game: name} = this.getPostParams();
        const game = this.module.getArena().getGame(name);
        if (!game) {
            throw new BadRequest('Game not found');
        }
        const template = game.getTemplate('playback', this);
        return this.render(template, {game});
    }

    getRoom (id) {
        let {room} = this.getPostParams();
        room = this.module.getArena().getRoom(id || room);
        if (!room) {
            throw new BadRequest('Room not found');
        }
        return room;
    }

    sendModelErrors (model) {
        const errors = model.getFirstErrorMap();
        const data = this.translateMessageMap(errors);
        return this.send(data, 400);
    }
};
module.exports.init(module);

const BadRequest = require('areto/error/http/BadRequest');