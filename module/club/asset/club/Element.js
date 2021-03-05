/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.Element = class Element {

    constructor (container, club) {
        this.club = club;
        this.container = container;
        this.$container = $(container);
        this.$container.data('handler', this);
    }

    find () {
        return this.$container.find(...arguments);
    }

    getCommand (name) {
        return this.find(`[data-command="${name}"]`);
    }

    getData (key) {
        return this.$container.data(key);
    }

    getDataUrl (action) {
        return this.club.getData('dataUrl') + action;
    }

    getMetaUrl (action) {
        return this.club.getData('metaUrl') + action;
    }

    getRoomUrl (action) {
        return this.club.getData('roomUrl') + action;
    }

    getOffset ($element) {
        const container = this.$container.offset();
        const {left, top} = $element.offset();
        return [left - container.left, top - container.top];
    }

    getClosestHandler (Class) {
        return Club.findHandler(Class, this.$container.parents('[data-handler]'));
    }

    getHandler (Class) {
        return Club.findHandler(Class, this.find(`[data-handler]`));
    }

    createHandlers () {
        return Club.createHandlers(this.club, this.container);
    }

    getTemplate (name) {
        return Club.getTemplate(name, this.container);
    }

    resolveTemplate (name, ...args) {
        return Club.resolveTemplate(this.getTemplate(name), ...args);
    }

    renderError (data) {
        return `${data.statusText}: ${data.responseText}`;
    }

    on () {
        return this.$container.on(...arguments);
    }

    trigger () {
        return this.$container.trigger(...arguments);
    }

    toggleClass () {
        return this.$container.toggleClass(...arguments);
    }

    setDataAttr (name, value) {
        this.$container.attr(`data-${name}`, value);
    }

    ajaxRoomAction (action, data) {
        return this.club.ajaxQueue.post(this.getRoomUrl(action), data);
    }
};