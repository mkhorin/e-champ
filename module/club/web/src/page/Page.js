/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.Page = class Page extends Club.Element {

    init () {
        this.name = this.getData('page');
        this.club.on('show:page', this.onPage.bind(this));
    }

    onPage (event, data) {
        if (this.name === data.name) {
            this.activate(data);
        }
    }

    activate () {
        const page = this.club.getActivePage();
        if (page && page !== this) {
            page.deactivate();
        }
        this.toggleClass('active', true);
        Jam.Helper.bindLabelsToInputs(this.$container);
        Jam.Helper.scrollTo(0);
    }

    deactivate () {
        this.toggleClass('active', false);
    }

    showPage () {
        this.club.showPage(this.name, ...arguments);
    }

    onFail (data) {
        this.toggleClass('loading', false);
        this.toggleAlert(true, data.responseText || data.statusText || data);
    }

    toggleAlert (state, message) {
        this.toggleClass('has-alert', state);        
        return this.find('.alert-error').first()
            .toggleClass('has-error', state)
            .html(Jam.t(message));
    }

    toggleLoading (state) {
        this.toggleClass('loading', state);
    }

    resolveResources () {
        return Jam.resource.resolve(...arguments);
    }

    setGameItemName (name) {
        this.find('.game-item-name').first().html(name);
    }
};