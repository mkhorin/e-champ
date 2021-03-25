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
        this.bots = this.createBots(this.bots);
        this.defaultBot = this.getBot(this.defaultBot);
        this.resolveTemplates();
    }

    hasAction (name) {
        return this.actions.hasOwnProperty(name);
    }

    getBot (name) {
        return this.bots.get(...arguments);
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

    attachStaticSources () {
        this.arena.attachStaticDirectory(...this.getStaticSource());
        for (const bot of this.bots) {
            bot.attachStaticSource();
        }
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

    createBots (data) {
        const bots = new DataMap;
        for (const name of Object.keys(data)) {
            bots.set(name, this.createBot(name, data[name]));
        }
        return bots;
    }

    createBot (name, data) {
        return ClassHelper.spawn({...this.bot, ...data, game: this, name});
    }

    serialize () {
        return {
            name: this.name,
            label: this.label,
            maxPlayers: this.maxPlayers,
            bots: this.serializeBots(),
            defaultBot: this.defaultBot?.name,
            defaultOpponents: this.defaultOpponents,
            options: this.options,
            optionAttrs: this.getOptionAttrs(),
            webPage: this.webPage
        };
    }

    serializeBots () {
        return this.bots.map(bot => bot.serialize());
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
const DataMap = require('areto/base/DataMap');
const Event = require('./Event');
const Room = require('./Room');
const path = require('path');