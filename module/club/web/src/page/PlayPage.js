/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.PlayPage = class PlayPage extends Club.Page {

    init () {
        super.init();
        this.$play = this.find('.play-container');
        this.info = new Club.PlayInfo({
            owner: this,
            handlerGetter: this.getPlay.bind(this)
        });
        this.find('[data-command="download"]').click(this.onDownload.bind(this));
    }

    getPlay () {
        return this.getHandler(Club.Play);
    }

    activate ({data}) {
        super.activate();
        this.clearPlay();
        const {room} = data;
        this.toggleLoading(true);
        this.ajaxRoomAction('play', {room})
            .then(this.resolveResources.bind(this))
            .then(this.startPlay.bind(this, data))
            .catch(this.onFail.bind(this));
    }

    startPlay (data, content) {
        Jam.t(this.$play.html(content));
        this.toggleLoading(false);
        this.createHandlers();
        this.info.clear();
        const play = this.getPlay();
        if (!play) {
            return this.toggleAlert(true, 'Play handler not found');
        }
        this.setGameItemName(play.getLabel());
        play.start(data, this);
    }

    deactivate () {
        super.deactivate();
        this.clearPlay();
    }

    clearPlay () {
        const play = this.getPlay();
        play?.detachSocket();
        play?.clear();
        this.$play.empty();
    }

    onDownload () {
        const play = this.getPlay();
        if (!play) {
            return false;
        }
        if (play.hasExportData()) {
            return this.downloadData(play.exportData());
        }
        const {room} = play;
        this.ajaxRoomAction('download', {room})
            .then(this.onExportData.bind(this, play))
            .catch(this.onFail.bind(this));
    }

    onExportData (play, data) {
        data = Object.assign(play.exportData(), data);
        this.downloadData(data);
    }

    downloadData (data) {
        const text = JSON.stringify(data);
        const blob = new Blob([text], {type: 'application/json'});
        const name = this.getDownloadName(data);
        saveAs(blob, name);
    }

    getDownloadName (data) {
        return `${data.game}-${moment().format('YY-MM-DD-HHmm')}.json`;
    }
};