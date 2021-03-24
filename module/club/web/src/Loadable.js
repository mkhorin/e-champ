/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.Loadable = class Loadable extends Club.Element {

    init () {
        this.$content = this.$container.children('.loadable-content');
    }

    isLoading () {
        return this.$container.hasClass('loading');
    }

    getUrl (key = 'url') {
        return this.getData(key) || this.getDataUrl(key);
    }

    setInstance (id) {
        this.id = id;
        this.clear();
        this.load();
    }

    load () {
        if (this.isLoading()) {
            return false;
        }
        this.toggleLoader(true);
        this._deferred = this.club.ajaxQueue
            .post(this.getUrl(), this.getPostData())
            .then(this.onBeforeDone.bind(this))
            .then(this.onDone.bind(this))
            .then(this.onAfterDone.bind(this))
            .fail(this.onFail.bind(this));
        return this._deferred;
    }

    getPostData () {
        return null;
    }

    toggleLoader (state) {
        this.$container.toggleClass('loading', state);
    }

    onBeforeDone (data) {
        return $.Deferred().resolve(data);
    }

    onDone (data) {
        this.toggleLoader(false);
        this.$content.html(this.render(data));
        Jam.t(this.$container);
        Jam.Helper.executeSerialImageLoading($(this.container));
    }

    onAfterDone () {
        this.createHandlers();
    }

    onFail (data) {
        this.toggleLoader(false);
        this.$content.html(this.renderError(data));
    }

    clear () {
        this.$content.html('');
    }

    render (data) {
        return data;
    }

    renderError (data) {
        return `${data.statusText}: ${data.responseText}`;
    }

    getItemTitle (key, data) {
        const item = data[key];
        if (item?.hasOwnProperty('_title')) {
            return item._title;
        }
        key = `${key}_title`;
        return data.hasOwnProperty(key) ? data[key] : item;
    }
};