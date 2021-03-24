/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.GatheringPage = class GatheringPage extends Club.Page {

    init () {
        super.init();
        this.form = this.getHandler(Club.Form);
        this.socket = this.club.socket;
        this.socketMessageHandler = this.onSocketMessage.bind(this);
        this.getCommand('create').click(this.onCreate.bind(this));
        this.getCommand('join').click(this.onJoin.bind(this));
    }

    activate (data) {
        super.activate();
        this.toggleAlert(false);
        this.toggleLoading(true);
        this.socket.on('message', this.socketMessageHandler);
        this.socket.send({
            room: this.club.getRoom(),
            player: this.club.getPlayer()
        });
    }

    deactivate () {
        super.deactivate();
        this.socket.off('message', this.socketMessageHandler);
    }

    onSocketMessage (event) {
        this.toggleAlert(false);
        this.toggleLoading(false);
        const data = Jam.Helper.parseJson(event.data);
        if (data.error) {
            return this.toggleAlert(true, data.error);
        }
        data.play
            ? this.club.showPage('play', {data})
            : this.form.setData(data);
    }

    onCreate () {
        this.club.showPage('new');
    }

    onJoin () {
        this.club.showPage('join');
    }
};