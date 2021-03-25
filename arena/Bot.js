/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Bot extends Base {

    constructor (config) {
        super({
            staticSource: null,
            templates: {},
            ...config
        });
        this.resolveTemplates();
    }

    createSolver (params) {
        return new this.solver.Class({...this.solver, ...params});
    }

    attachStaticSource () {
        if (this.staticSource) {
            this.game.arena.attachStaticDirectory(this.getStaticRoute(), this.getPath(this.staticSource));
        }
    }

    getPath () {
        return path.join(this.CLASS_DIRECTORY, ...arguments);
    }

    getStaticRoute () {
        return `/bot/${this.game.name}/${this.name}`;
    }

    getTemplate (name) {
        return this.templates[name];
    }

    resolveTemplates () {
        if (this.templates) {
            for (const name of Object.keys(this.templates)) {
                this.templates[name] = this.getPath(this.templates[name]);
            }
        }
    }

    serialize () {
        return {
            name: this.name,
            label: this.label,
            translations: this.translations
        };
    }

    translateLabel () {
        return this.translate('label', ...arguments) || this.label;
    }

    translate (key, language) {
        return this.translations?.[language]?.[key];
    }
};
module.exports.init();

const path = require('path');