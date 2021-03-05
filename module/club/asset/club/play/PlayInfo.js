/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.PlayInfo = class PlayInfo {

    constructor (data) {
        this.owner = data.owner;
        this.$info = data.$info || this.owner.find('.play-info');
        this.$toggle = data.$toggle || this.owner.find('[data-command="info"]');
        this.handlerGetter = data.handlerGetter;
        this.$toggle.click(this.onToggle.bind(this));
    }

    clear () {
        this.$info.empty();
    }

    onToggle () {
        this.$info.html(this.renderInfo());
    }

    renderInfo () {
        const handler = this.handlerGetter();
        return handler
            ? this.renderInfoItems(handler.getInfoItems())
            : `<div>${Jam.t('No data')}</div>`;
    }

    renderInfoItems (items) {
        return items.map(data => this.renderInfoItem(...data)).join('');
    }

    renderInfoItem (label, value) {
        return `<div><label>${label}:</label> ${value}</div>`;
    }
};