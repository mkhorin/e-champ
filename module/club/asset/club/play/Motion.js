/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.Motion = class Motion {

    constructor () {
        this.clear();
    }

    isActive () {
        return this.moves.length > 0;
    }

    getMoveByElement (element) {
        for (const move of this.moves) {
            if (move.element === element) {
                return move;
            }
        }
    }

    count () {
        return this.moves.length;
    }

    clear () {
        this.moves = [];
        this.endHandlers = [];
    }

    done (handler) {
        this.endHandlers.push(handler);
        setTimeout(this.resolveEndHandlers.bind(this), 10);
    }

    move (config) {
        const move = new Club.MotionElement({...config, motion: this});
        this.moves.push(move);
        move.start();
        return move;
    }

    remove (move) {
        this.moves.splice(this.moves.indexOf(move), 1);
    }

    resolveEndHandlers () {
        if (!this.moves.length) {
            this.executeEndHandlers();
        }
    }

    executeEndHandlers () {
        const handlers = this.endHandlers;
        this.endHandlers = [];
        for (const handler of handlers) {
            handler();
        }
    }
};