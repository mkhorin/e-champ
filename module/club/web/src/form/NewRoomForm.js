/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.NewRoomForm = class NewRoomForm extends Club.Form {

    init () {
        super.init();
        this.gameAttr = this.getAttrHandler('game');
        this.gameAttr.on('change', this.onChangeGame.bind(this));
        this.checkForAnyGame();
    }

    getOptionHandler (key) {
        return this.getAttrHandler(this.getOptionAttrName(key));
    }

    getOptionAttrName (key) {
        return `options[${key}]`;
    }

    onChangeGame () {
        this.game = this.club.getGameData(this.gameAttr.getValue());
        this.createGameOptions();
    }

    createGameOptions () {        
        const $group = this.$optionGroup.empty();
        const attrs = this.game?.optionAttrs;
        if (Array.isArray(attrs)) {
            $group.html(attrs.map(this.renderAttr, this).join(''));
            Jam.Helper.bindLabelsToInputs($group);
            Jam.t($group);
            Club.createHandlers(this.club, $group.get(0));
            this.setOptionDefaultValues();
            this.setOptionReadOnlyState(attrs);
        }
    }

    renderAttr (data) {
        switch (data.view) {
            case 'select': return this.renderSelectAttr(data);
        }
        return this.renderDefaultAttr(data);
    }

    renderSelectAttr (data) {
        const items = data.items.map(this.renderSelectAttrItem, this).join('');
        return this.renderDefaultAttr({...data, items});
    }

    renderSelectAttrItem ({value, text}) {
        text = text ? Jam.t(text, this.game.name) : value;
        return `<option value="${value}">${text}</option>`;
    }

    renderDefaultAttr (data) {
        const name = this.getOptionAttrName(data.name);
        const t = this.game.name;
        return this.resolveTemplate(data.view, {...data, name, t});
    }

    setOptionDefaultValues () {
        for (const name of Object.keys(this.game.options)) {
            const handler = this.getOptionHandler(name);
            if (handler) {
                handler.setValue(this.game.options[name]);
            }
        }
    }

    setOptionReadOnlyState (attrs) {
        for (const {name, readonly} of attrs) {
            if (readonly) {
                this.getOptionHandler(name).toggleDisabled(true);
            }
        }
    }
};