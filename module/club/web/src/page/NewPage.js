/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.NewPage = class NewPage extends Club.Page {

    init () {
        super.init();
        this.form = this.getHandler(Club.Form);
        this.getCommand('create').click(this.onCreate.bind(this));
    }

    activate () {
        super.activate();
    }

    onCreate () {
        if (this.form.validate()) {
            this.ajaxRoomAction('create', this.form.serialize())
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