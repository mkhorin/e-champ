/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

class Club {

    static ROOM_STORE_KEY = 'userRoomId';
    static PLAYER_STORE_KEY = 'userPlayerId';

    static getElementClass (name) {
        return this[name]?.prototype instanceof this.Element ? this[name] : null;
    }

    static findHandler (Class, $elements) {
        for (const element of $elements) {
            const handler = $(element).data('handler');
            if (handler instanceof Class) {
                return handler;
            }
        }
    }

    static toggle ($element, state) {
        return $element.toggleClass('hidden', !state);
    }

    static getTemplate (name, container) {
        return container.querySelector(`template[data-id="${name}"]`)?.innerHTML;
    }

    static resolveTemplate (text, data, start = '{{', end = '}}') {
        const regex = new RegExp(`${start}(\\w+)${end}`, 'gm');
        return text.replace(regex, (match, key)=> {
            const value = data[key];
            return data.hasOwnProperty(key) && value !== undefined && value !== null ? value : '';
        });
    }

    static setPageTitle (text) {
        const $title = $(document.head).find('title');
        const base = $title.data('title');
        $title.html(text ? `${Jam.t(text)} - ${base}` : base);
    }

    static escapeData (data, keys) {
        for (const key of keys || Object.keys(data)) {
            data[key] = this.escapeHtml(data[key]);
        }
    }

    static escapeHtml (value) {
        return typeof value === 'string' ? value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
    }

    static createHandlers (club, container) {
        const handlers = [];
        for (const element of container.querySelectorAll('[data-handler]')) {
            const name = $(element).data('handler');
            if (typeof name === 'string') {
                const Class = this.getElementClass(name);
                if (Class) {
                    handlers.push(new Class(element, club));
                } else {
                    console.error(`Handler not found: ${name}`);
                }
            }
        }
        for (const handler of handlers) {
            if (handler.init) {
                handler.init();
            }
        }
    }

    static setElementOffset (left, top, element) {
        if (element instanceof $) {
            element = element.get(0);
        }
        if (element) {
            element.style.left = `${left}px`;
            element.style.top = `${top}px`;
        }
    }

    static getOffsetStep (size, itemSize, total, maxSpace) {
        const step = total > 1 ? Math.floor((size - itemSize) / (total - 1)) : 0;
        const maxStep = itemSize + maxSpace;
        return step > maxStep ? maxStep : step < 1 ? 0 : step;
    }

    static getElementRect (element) {
        if (element instanceof $) {
            element = element.get(0);
        }
        return {
            x: element.offsetLeft,
            y: element.offsetTop,
            w: element.offsetWidth,
            h: element.offsetHeight
        };
    }

    constructor () {
        this.ajaxQueue = new this.constructor.AjaxQueue;
        this.$container = $('.club');
        this.meta = new this.constructor.Meta(this);
        this.socket = new Club.Socket(this.getData('socketPath'), this);
        this.prepareGames();
        this.constructor.createHandlers(this, document);
        this.on('click', '.nav-link', this.onTab.bind(this));
        this.on('click', '.form-set-toggle', this.onGroup.bind(this));
        this.on('click', '[data-action="main"]', this.onMain.bind(this));
        this.on('action:auth', this.onAuth.bind(this));
    }

    isGuest () {
        return this.getData('guest');
    }

    isUser (id) {
        return id && this.getData('user') === id;
    }

    getData (key) {
        return this.$container.data(key);
    }

    getGameData (name) {
        for (const game of this.games) {
            if (game.name === name) {
                return game;
            }
        }
    }

    prepareGames () {
        this.games = this.getData('games');
        for (const data of this.games) {
            this.translateBots(data);
        }
    }

    resolvePlayerName ({type, name}, game) {
        return type === 'bot'
            ? game.bots.filter(data => data.name === name)[0]?.label || name
            : name;
    }

    translateBots (game) {
        const language = Jam.i18n.getLanguage();
        for (const data of game.bots) {
            data.label = data.translations?.[language]?.label || data.label;
        }
    }

    showPage (name, data) {
        this.trigger('show:page', Object.assign({name}, data));
    }

    getActivePage () {
        return this.getPages().filter(`.active`).data('handler');
    }

    getPage (name) {
        return this.getPages().filter(`[data-page="${name}"]`).data('handler');
    }

    getPages () {
        return this.$container.children('.page');
    }

    getActionTarget (event, key = 'id') {
        return $(event.currentTarget).closest(`[data-${key}]`).data(key);
    }

    getHandler (Class) {
        return Club.findHandler(Class, this.$container.find(`[data-handler]`));
    }

    getAuthAction (action) {
        return `action:${this.isGuest() ? 'auth' : action}`;
    }

    getParentHandler (element) {
        return $(element).closest('[data-handler]').data('handler');
    }

    toggleLoader (state) {
        $('.global-loader').toggle(state);
        $(document.body).toggleClass('loading', state);
    }

    on () {
        this.$container.on(...arguments);
    }

    trigger () {
        this.$container.trigger(...arguments);
    }

    onTab (event) {
        event.preventDefault();
        const $nav = $(event.currentTarget);
        const id = $nav.data('id');
        const $tabs = $nav.closest('.tabs');
        const $content = $tabs.children('.tab-content');
        $nav.parent().children('.active').removeClass('active');
        $content.children('.active').removeClass('active');
        $nav.addClass('active');
        $content.children(`[data-id="${id}"]`).addClass('active');
        $tabs.trigger('tab:active', {id});
    }

    onGroup (event) {
        $(event.currentTarget).closest('.form-set').toggleClass('active');
    }

    onAuth (event) {
        event.preventDefault();
        location.assign('auth/sign-in?returnUrl=/club');
    }

    onMain (event) {
        event.preventDefault();
        this.showPage('main');
    }

    getRoom () {
        return Jam.localStorage.get(Club.ROOM_STORE_KEY);
    }

    setRoom (id) {
        Jam.localStorage.set(Club.ROOM_STORE_KEY, id);
    }

    getPlayer (id) {
        return Jam.localStorage.get(Club.PLAYER_STORE_KEY);
    }

    setPlayer (id) {
        Jam.localStorage.set(Club.PLAYER_STORE_KEY, id);
    }
}