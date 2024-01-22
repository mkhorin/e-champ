/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.FormOpponents = class FormOpponents extends Club.FormAttr {

    static BOT_TYPE = 'bot';
    static REMOTE_TYPE = 'remote';

    init () {
        super.init();
        this.$list = this.find('.new-opponents');
        this.on('change', '.form-opponent input', this.onChangeItemType.bind(this));
        this.on('change', '.form-opponent select', this.onChangeSelection.bind(this));
        this.form.gameAttr.on('change', this.onChangeGame.bind(this));
        this.onChangeGame();
    }

    onChangeGame () {
        this.renderItems();
        this.setDefaultOpponents();
    }

    renderItems () {
        const items = [];
        const {game} = this.form;
        if (game) {
            for (let i = 1; i < game.maxPlayers; ++i) {
                items.push(this.renderItem(i, game));
            }
        }
        Jam.t(this.$list.html(items.join('')));
        Jam.Helper.bindLabelsToInputs(this.$list);
        this.refreshValue();
    }

    renderItem (index, data) {
        const bots = this.renderBots(data);
        const number = index + 1;
        return this.resolveTemplate('opponent', {number, bots});
    }

    renderBots (data) {
        return data.bots.map(this.renderBot.bind(this, data)).join('');
    }

    renderBot (data, {name, label}) {
        const selected = name === data.defaultBot ? 'selected' : '';
        return `<option value="${name}" ${selected}>${label}</option>`;
    }

    setDefaultOpponents () {
        const opponents = this.form.game?.defaultOpponents;
        if (Array.isArray(opponents)) {
            for (let i = 0; i < opponents.length; ++i) {
                this.setDefaultOpponent(opponents[i], i);
            }
        }
    }

    setDefaultOpponent (data, index) {
        const [type, bot] = data.split(':');
        const $type = this.find(`[value="${type}"]`).eq(index).click();
        if (bot) {
            const $opponent = $type.closest('.form-opponent');
            $opponent.find('select').val(bot).change();
        }
    }

    getValue (name) {
        const result = [];
        const elements = this.find('.form-opponent');
        for (const element of elements) {
            const value = this.getItemValue($(element));
            result.push(value);
        }
        return result.filter(v => !!v).join();
    }

    getItemValue ($element) {
        const type = $element.find(':checked').val();
        const bot = $element.find('select').val();
        return type ? `${type}:${bot}` : null;
    }

    refreshValue () {
        this.setValue(this.getValue());
    }

    getItemByElement (element) {
        return $(element).closest('.form-opponent');
    }

    onChangeItemType (event) {
        const $item = this.getItemByElement(event.target);
        $item.find('input').not(event.target).prop('checked', false);
        $item.attr('data-type', $item.find(':checked').val());
        this.refreshValue();
        this.clearErrors();
    }

    onChangeSelection () {
        this.refreshValue();
    }
};