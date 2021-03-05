/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.AjaxQueue = class AjaxQueue {

    constructor () {
        this._tasks = [];
    }

    post (...args) {
        const deferred = $.Deferred();
        this._tasks.push({deferred, args});
        this.execute();
        return deferred;
    }

    remove (deferred) {
        const index = this.getTaskIndex(deferred);
        if (index !== undefined) {
            this._tasks.splice(index, 1);
        }
    }

    getTaskIndex (deferred) {
        for (let i = 0; i < this._tasks.length; ++i) {
            if (this._tasks[i].deferred === deferred) {
                return i;
            }
        }
    }

    execute () {
        if (this._xhr || !this._tasks.length) {
            return false;
        }
        const {deferred, args} = this._tasks.splice(0, 1)[0];
        const data = Jam.addCsrfToken(args[1]);
        const params = {
            method: 'post',
            contentType: 'application/json',
            url: args[0],
            data: typeof data !== 'string' ? JSON.stringify(data) : data
        };
        this._xhr = $.post(args[0], data)
            .always(()=> this._xhr = null)
            .done(data => deferred.resolve(data))
            .fail(data => deferred.reject(data));
        deferred.done(this.next.bind(this));
        deferred.fail(this.next.bind(this));
    }

    next () {
        this.execute();
    }

    abort () {
        this._xhr?.abort();
        this._xhr = null;
    }
};