/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/base/BaseController');

module.exports = class GameController extends Base {

    createModel () {
        const arena = this.module.getArena();
        return super.createModel({arena});
    }

    getModelClass () {
        return this.getClass('model/Game');
    }

    async actionIndex () {
        const model = this.createModel();
        await this.render('index', {model});
    }

    async actionList () {
        const model = this.createModel();
        const params = this.getPostParams();
        const data = await model.getListData(params);
        this.sendJson(data);
    }

    async actionUpdate () {
        const {id} = this.getQueryParams();
        const model = this.createModel();
        const game = model.getGame(id);
        if (!game) {
            throw new NotFound('Game not found');
        }
        await this.render('update', {model, game});
    }
};
module.exports.init(module);

const NotFound = require('areto/error/http/NotFound');