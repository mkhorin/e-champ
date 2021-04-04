/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.Play = class Play extends Club.Element {

    static ACTION_START = 'start';

    constructor () {
        super(...arguments);
        this.motion = new Club.Motion;
        this.socketMessageHandler = this.onSocketMessage.bind(this);
    }

    isFinished () {
        return false;
    }

    createEvents (params) {
        return new Club.PlayEvents({
            play: this,
            startEvent: 'round',
            ...params
        });
    }

    getElementRect (selector) {
        return Club.getElementRect(this.find(selector));
    }

    setGame (name) {
        this.game = this.club.getGameData(name);
    }

    start (data, page) {
        this.clear();
        this.messageTimestamp = data.timestamp;
        this.page = page;
        this.room = data.room;
        this.player = data.player;
        this.round = 0;
        this.attachSocket(page.club.socket);
    }

    clear () {
        this.motion.clear();
    }

    attachSocket (socket) {
        this.detachSocket();
        this.socket = socket;
        this.socket.on('message', this.socketMessageHandler);
        this.send(this.constructor.ACTION_START);
    }

    detachSocket () {
        this.socket?.off('message', this.socketMessageHandler);
        this.socket = null;
    }

    onSocketMessage (event) {
        const data = Jam.Helper.parseJson(event.data);
        data.error
            ? this.onErrorMessage(data.error)
            : this.onMessage(data);
    }

    onMessage (data) {
        this.messageTimestamp = data.timestamp;
        console.log('Socket message', this.messageTimestamp);
    }

    onErrorMessage (message) {
        Jam.dialog.error(message);
    }

    send (action, data) {
        this.socket.send({...this.getSendData(), action, ...data});
    }

    getSendData () {
        return {
            timestamp: this.messageTimestamp,
            room: this.room,
            player: this.player
        };
    }

    getLabel () {
        return this.translate(this.game.label);
    }

    resolvePlayerName (data) {
        return this.club.resolvePlayerName(data, this.game);
    }

    setGameLabel (name) {
        this.page.setGameItemName(this.translate(name));
    }

    translate (message) {
        return Jam.t(message, this.game.name);
    }

    getOptionAttr (name) {
        if (this.game.optionAttrs) {
            for (const attr of this.game.optionAttrs) {
               if (attr.name === name) {
                   return attr;
               }
            }
        }
    }

    getInfoItems () {
        return [...this.getTopInfoItems(), ...this.getOptionInfoItems()];
    }

    getTopInfoItems () {
        return [
            [Jam.t('Game'), this.translate(this.game.label)],
            [Jam.t('Current round'), this.round + 1]
        ];
    }

    getOptionInfoItems () {
        return this.game.optionAttrs?.map(({name, label}) => {
            return [this.translate(label), this.translate(this.options[name])];
        }) || [];
    }

    hasExportData () {
        return true; // use existing play data or retrieve from server
    }

    exportData () {
        return {
            game: this.game.name
        };
    }

    toggleAlert () {
        this.page.toggleAlert(...arguments)
    }
};