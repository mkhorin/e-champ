/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.FormOpponents = class FormOpponents extends Club.FormAttr {

    init () {
        super.init();
        this.$list = this.find('.new-opponents');
        this.on('change', '.form-opponent input', this.onChangeItemType.bind(this));
        this.on('change', '.form-opponent select', this.onChangeSelect.bind(this));
        this.form.gameAttr.on('change', this.onChangeGame.bind(this));
        this.onChangeGame();
    }

    onChangeGame () {
        this.renderItems();
        //this.find('[value="bot"]').slice(0, 3).click();
    }

    renderItems () {
        const items = [];
        if (this.form.game) {
            for (let i = 1; i < this.form.game.maxPlayers; ++i) {
                items.push(this.renderItem(i, this.form.game));
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
        return data.bots.map(({name, label}) => {
            const selected = name === data.defaultBot ? ' selected' : '';
            return `<option value="${name}"${selected}>${label}</option>`;
        }).join('');
    }

    getValue (name) {
        const result = [];
        for (const element of this.find('.form-opponent')) {
            result.push(this.getItemValue($(element)));
        }
        return result.filter(value => !!value).join();
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

    onChangeSelect () {
        this.refreshValue();
    }
};