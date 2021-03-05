/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.JoinPage = class JoinPage extends Club.Page {

    init () {
        super.init();
        this.form = this.getHandler(Club.Form);
        this.getCommand('join').click(this.onJoin.bind(this));
    }

    activate () {
        super.activate();
        this.form.clear();
        this.form.setValue('room', this.club.getRoom());
        this.form.setValue('player', this.club.getPlayer());
        this.form.loadRooms();
    }

    onJoin () {
        if (this.form.validate()) {
            this.ajaxRoomAction('join', this.form.serialize())
                .done(this.onDone.bind(this))
                .fail(this.onFail.bind(this));
        }
    }

    onDone (data) {
        this.club.setRoom(data.room);
        this.club.setPlayer(data.player);
        this.club.showPage('gathering', {data});
    }

    onFail () {
        this.form.onFail(...arguments);
    }
};