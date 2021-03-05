'use strict';

const Base = require('areto/base/Model');

module.exports = class Room extends Base {

    static getConstants () {
        return {
            RULES: [
                [['name', 'game', 'opponents'], 'required'],
                [['game', 'opponents'], 'string'],
                ['private', 'checkbox'],
                ['name', 'validator/UserNameValidator'],
                ['game', 'validateGame', {skipOnAnyError: true}],
                ['opponents', 'validateOpponents', {skipOnAnyError: true}],
                ['options', 'validateOptions', {skipOnAnyError: true, skipOnEmpty: false}]
            ]
        };
    }

    getRoomData () {
        return {
            game: this.game,
            public: !this.get('private'),
            options: this.options,
            players: [{
                type: 'remote',
                name: this.get('name'),
                ip: this.ip,
                ready: true
            }, ...this.opponents]
        };
    }

    validateGame (attr) {
        const arena = this.module.getArena();
        this.game = arena.games.get(this.get(attr));
        if (!this.game) {
            this.addError(attr, 'Game not found');
        }
    }

    validateOpponents (attr) {
        const items = this.get(attr).split(',');
        if (items.length >= this.game.maxPlayers) {
            return this.addError(attr, 'Too many opponents');
        }
        this.opponents = [];
        for (const item of items) {
            const [type, bot] = item.split(':');
            if (type !== 'remote' && type !== 'bot') {
                return this.addError(attr, 'Invalid player type: ${type}');
            }
            if (type === 'bot' && !this.game.getBot(bot)) {
                return this.addError(attr, 'Invalid bot: ${bot}');
            }
            this.opponents.push({type, bot});
        }
    }

    async validateOptions () {
        this.options = {
            ...this.game.options
        };
        if (!this.game.optionModel) {
            return true;
        }
        const model = this.spawn(this.game.optionModel);
        model.setSafeAttrs(this.get('options'));
        if (await model.validate()) {
            Object.assign(this.options, model.getAttrMap());
            return true;
        }
        const errors = model.getFirstErrorMap();
        for (const key of Object.keys(errors)) {
            this.addError(`options[${key}]`, errors[key]);
        }
    }
};
module.exports.init(module);