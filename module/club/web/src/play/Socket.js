/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.Socket = class Socket {

    constructor (path, club) {
        this.club = club;
        this.path = path;
    }

    send (data) {
        this.open().then(() => this._socket.send(JSON.stringify(data)));
    }

    on (event, handler) {
        this.open().then(() => this._socket.addEventListener(event, handler));
    }

    off (event, handler) {
        this.open().then(() => this._socket.removeEventListener(event, handler));
    }

    open () {
        if (!this._opening) {
            this._opening = $.Deferred();
            this._socket = this.createWebSocket(this.getUrl());
        }
        return this._opening;
    }

    createWebSocket (url) {
        const socket = new WebSocket(url);
        socket.addEventListener('open', this.onOpen.bind(this));
        socket.addEventListener('close', this.onClose.bind(this));
        socket.addEventListener('error', this.onError.bind(this));
        return socket;
    }

    getUrl () {
        return `${location.protocol.replace('http', 'ws')}//${location.host}${this.path}`;
    }

    onOpen () {
        this._opening.resolve();
    }

    onClose () {
        Jam.dialog.error('WebSocket connection closed').then(() => location.reload());
    }

    onError () {
        Jam.dialog.error('WebSocket connection failed').then(() => location.reload());
        this._opening.reject();
    }
};