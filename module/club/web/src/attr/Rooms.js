/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.FormRooms = class FormRooms extends Club.FormAttr {

    init () {
        super.init();
        this.gameFilter = this.form.getAttrHandler('game');
        this.gameFilter.on('change', this.render.bind(this));
        this.on('click', '.item-head', this.onClickItem.bind(this));
        this.on('click', '.join', this.onJoinItem.bind(this));
    }

    refresh () {
        this.toggleClass('empty', false);
        this.toggleClass('loading', true);
        this.ajaxRoomAction('list').done(this.onList.bind(this));
    }

    onList (data) {
        this.toggleClass('loading', false);
        this.items = data;
        this.render();
    }

    getItem (id) {
        for (const item of this.items) {
            if (item.room === id) {
                return item;
            }
        }
    }

    render () {
        const game = this.gameFilter.getValue();
        const items = game
            ? this.items.filter(item => item.name === game)
            : this.items;
        const result = items.map(this.renderItem, this);
        this.find('.list').html(result.join(''));
        this.toggleClass('empty', !items.length);
    }

    renderItem (data) {
        return this.resolveTemplate('item', {
            room: data.room,
            label: Jam.t(data.label, data.name),
            params: this.renderItemParams(data),
            join: Jam.t('Join')
        });
    }

    renderItemParams ({players, options}) {
        const freePlayers = players.filter(({ready}) => !ready);
        const result = [
            this.renderItemParam('Players', players.length),
            this.renderItemParam('Free', freePlayers.length)
        ];
        return result.join('');
    }

    renderItemParam (label, value) {
        return this.resolveTemplate('param', {
            label: Jam.t(label),
            value: this.form.stringifyOptionValue(value)
        });
    }

    onClickItem ({currentTarget}) {
        this.toggleOpenItem($(currentTarget).closest('.item'));
    }

    toggleOpenItem ($item) {
        this.find('.open').not($item).removeClass('open');
        const item = this.getItem($item.data('id'));
        $item.find('.item-body').html(this.renderItemOptions(item));
        $item.toggleClass('open');
    }

    renderItemOptions (data) {
        const game = this.club.getGameData(data.name);
        return this.form.renderOptions({
            data: data.options,
            name: game.name,
            attrs: game.optionAttrs,
            template: 'option'
        });
    }

    onJoinItem (event) {
        event.stopPropagation();
        const $item = $(event.currentTarget).closest('.item');
        this.form.setValue('room', $item.data('id'));
        this.form.getCommand('join').click();
    }
};