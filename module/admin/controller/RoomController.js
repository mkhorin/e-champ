/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/base/BaseController');

module.exports = class RoomController extends Base {

    createModel () {
        const arena = this.module.getArena();
        return super.createModel({arena});
    }

    getModelClass () {
        return this.getClass('model/Room');
    }

    async actionIndex () {
        const model = this.createModel();
        await this.render('index', {model});
    }

    async actionList () {
        const model = this.createModel();
        const data = await model.getListData(this.getPostParams());
        this.sendJson(data);
    }

    async actionUpdate () {
        const {id} = this.getQueryParams();
        const model = this.createModel();
        const room = model.getRoom(id);
        if (!room) {
            throw new NotFound('Room not found');
        }
        await this.render('update', {model, room});
    }

    async actionDelete () {
        const {id} = this.getPostParams();
        const model = this.createModel();
        const room = model.getRoom(id);
        if (!room) {
            throw new NotFound('Room not found');
        }
        await room.remove();
        this.send('Ok');
    }
};
module.exports.init(module);

const NotFound = require('areto/error/http/NotFound');