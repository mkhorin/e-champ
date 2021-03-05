/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = class BotSolver {

    constructor (config) {
        Object.assign(this, config);
    }

    /**
     * Start solver
     * @param {Object} data - Play state snapshot
     * @param {Object} data.options - Play options
     */
    execute (data) {
    }

    /**
     * Return player action as solver result
     * @param {string} action - Action name
     * @param {Object} [data] - Action data
     */
    complete (action, data) {
        this.doneHandler(this, action, data);
    }

    clear () {
        this.cleared = true;
    }
};