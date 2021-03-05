/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.PlaybackPage = class PlaybackPage extends Club.Page {

    init () {
        super.init();
        this.$playback = this.find('.playback-container');
        this.info = new Club.PlayInfo({
            owner: this,
            handlerGetter: this.getPlayback.bind(this)
        });
    }

    activate ({data, file}) {
        super.activate();
        this.clearPlay();
        this.toggleLoading(true);
        this.ajaxRoomAction('playback', {game: data.game})
            .then(this.resolveResources.bind(this))
            .then(this.startPlay.bind(this, data, file))
            .fail(this.onFail.bind(this));
    }

    deactivate () {
        super.deactivate();
        this.clearPlay();
    }

    startPlay (data, file, content) {
        Jam.t(this.$playback.html(content));
        this.toggleLoading(false);
        this.createHandlers();
        this.info.clear();
        const playback = this.getPlayback();
        if (!playback) {
            return this.toggleAlert(true, 'Playback handler not found');
        }
        const filename = Jam.StringHelper.trimEnd(file.name, '.json');
        const label = `<b>${playback.getLabel()}</b> (${filename})`;
        this.find('.game-item-name').first().html(label);
        playback.start(data, this);
    }

    clearPlay () {
        this.getPlayback()?.clear();
        this.$playback.empty();
    }

    getPlayback () {
        return this.getHandler(Club.Play);
    }
};