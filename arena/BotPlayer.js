/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Player = require('./Player');

module.exports = class BotPlayer extends Player {

    constructor (config) {
        super({
            minStartDelay: 500,
            maxStartDelay: 1000,
            ready: true,
            ...config
        });
        this.bot = this.room.game.getBot(this.bot);
        if (this.bot.solver) {
            this.solverConfiguration = this.createSolverConfiguration();
        }
        this.name = this.bot.name;
    }

    isBot () {
        return true;
    }

    createSolverConfiguration () {
        return {
            ...this.bot.solver,
            doneHandler: this.onSolved.bind(this)
        };
    }

    createSolver (data) {
        this.clearSolver();
        this.solver = new this.solverConfiguration.Class(this.solverConfiguration);
        const delay = MathHelper.random(this.minStartDelay, this.maxStartDelay);
        this.solverTimer = setTimeout(this.executeSolver.bind(this, data), delay);
    }

    executeSolver (data) {
        try {
            this.solver.execute(data);
        } catch (err) {
            this.log('error', err);
            this.room.play?.setError(`Bot: ${this.name}: ${err.toString()}`);
        }
    }

    onSolved (origin, action, data) {
        if (this.solver === origin) {
            this.room.play?.onBotMessage({action, ...data}, this);
            this.solver = null;
        }
    }

    clear () {
        this.clearSolver();
    }

    clearSolver () {
        this.solver?.clear();
        this.solver = null;
        clearTimeout(this.solverTimer);
    }

    getData () {
        return Object.assign(super.getData(), {
            params: this.bot.params
        });
    }
};

const MathHelper = require('areto/helper/MathHelper');