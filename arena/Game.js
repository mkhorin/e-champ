/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Game extends Base {

    constructor (config) {
        super({
            bot: {Class: Bot},
            bots: {},
            event: {Class: Event},
            events: {},
            room: {Class: Room},
            staticSource: 'web',
            templates: {},
            ...config
        });
        this.createBots();
        this.defaultBot = this.getBot(this.defaultBot);
        this.resolveTemplates();
    }

    hasAction (name) {
        return this.actions.hasOwnProperty(name);
    }

    getBot (name) {
        return ObjectHelper.getValue(name, this.bots);
    }

    getEventConfig (name) {
        return this.events.hasOwnProperty(name) ? this.events[name] : this.event;
    }

    getPath () {
        return path.join(this.CLASS_DIRECTORY, ...arguments);
    }

    createRoom (data) {
        return ClassHelper.spawn({...this.room, ...data, game: this});
    }

    getStaticSource () {
        return [this.getStaticRoute(), this.getPath(this.staticSource)];
    }

    getStaticRoute () {
        return `/game/${this.name}`;
    }

    getTemplate (name) {
        return this.templates[name];
    }

    resolveTemplates () {
        for (const name of Object.keys(this.templates)) {
            this.templates[name] = this.getPath(this.templates[name]);
        }
    }

    createBots () {
        const game = this;
        for (const name of Object.keys(this.bots)) {
            this.bots[name] = ClassHelper.spawn({...this.bot, ...this.bots[name], name, game});
        }
    }

    serialize () {
        return {
            name: this.name,
            label: this.label,
            maxPlayers: this.maxPlayers,
            bots: this.serializeBots(),
            defaultBot: this.defaultBot?.name,
            options: this.options,
            optionAttrs: this.getOptionAttrs(),
            webPage: this.webPage
        };
    }

    serializeBots () {
        return Object.values(this.bots).map(bot => bot.serialize());
    }

    getOptionAttrs () {
        return this.optionModel?.Class.ATTRS;
    }

    getOptionAttr (name) {
        const attrs = this.getOptionAttrs();
        if (Array.isArray(attrs)) {
            for (const attr of attrs) {
                if (attr.name === name) {
                    return attr;
                }
            }
        }
    }
};
module.exports.init();

const Bot = require('./Bot');
const ClassHelper = require('areto/helper/ClassHelper');
const Event = require('./Event');
const ObjectHelper = require('areto/helper/ObjectHelper');
const Room = require('./Room');
const path = require('path');