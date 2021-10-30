/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.Form = class Form extends Club.Element {

    init () {
        this.$topError = this.find('.alert-error');
        this.$optionGroup = this.find('.option-group');
    }

    checkForAnyGame () {
        if (this.club.games.length) {
            return true;
        }
        this.setFatalError('No games found');
    }

    clear () {
        this.clearErrors();
        this.find('[name]').val('');
        this.trigger('clear');
    }

    hasAttr (name) {
        return this.getValueElement(name).length > 0;
    }

    getAttr (name) {
        return this.getAttrByElement(this.getValueElement(name));
    }

    getAttrByElement (element) {
        return this.find(element).closest('.form-attr');
    }

    getValue (name) {
        return this.getValueElement(name).val();
    }

    setValue (name, value) {
        return this.getValueElement(name).val(value);
    }

    getValueElement (name) {
        return this.find(`[name="${name}"]`);
    }

    getAttrHandler (name) {
        return this.getAttr(name).data('handler');
    }

    hasError () {
        return this.find('.has-error').length > 0;
    }

    setFatalError (message) {
        this.setTopError(message);
        this.toggleClass('has-fatal-error');
    }

    setTopError (message) {
        this.$topError.html(Jam.t(message)).addClass('has-error');
    }

    addErrors (data) {
        if (!data) {
            return false;
        }
        if (typeof data === 'string') {
            return this.setTopError(data);
        }
        const topErrors = [];
        for (const name of Object.keys(data)) {
            this.hasAttr(name)
                ? this.addError(name, data[name])
                : topErrors.push(`${name}: ${data[name]}`);
        }
        if (topErrors.length) {
            this.setTopError(topErrors.join('<br>'));
        }
    }

    addError (name, message) {
        const $attr = this.getAttr(name);
        const $block = $attr.addClass('has-error').find('.error-block');
        $block.html(Jam.t(message, $block.data('t')));
        $attr.parents('.form-set').addClass('has-group-error');
    }

    clearErrors () {
        this.find('.has-error').removeClass('has-error');
        this.find('.has-group-error').removeClass('has-group-error');
    }

    setErrors (data) {
        this.addErrors(Jam.Helper.parseJson(data));
    }

    onFail (data) {
        this.setErrors(data.responseJSON || data.responseText);
        this.scrollToError();
    }

    serialize () {
        const result = {};
        for (const item of this.find('[name]')) {
            result[item.name] = $(item).val();
        }
        return result;
    }

    focus (name) {
        this.getValueElement(name).focus();
    }

    validate () {
        this.clearErrors();
        for (const item of this.find('[name]')) {
            const $attr = this.getAttrByElement(item);
            const value = $(item).val();
            if ($attr.hasClass('required') && !value) {
                this.addError(item.name, 'Value cannot be blank');
            }
            const handler = $attr.data('handler');
            if (handler) {
                handler.validate();
            }
        }
        this.scrollToError();
        return !this.find('.has-error').length;
    }

    scrollToError () {
        Jam.Helper.scrollTo(this.find('.has-error').first());
    }

    renderOptions ({data, name, attrs, template}) {
        return Array.isArray(attrs)
            ? attrs.map(attr => this.renderOption(attr, data, template, name)).join('')
            : '';
    }

    renderOption ({name, label}, data, template, game) {
        const value = this.stringifyOptionValue(data[name]);
        if (typeof value === 'string' && !value) {
            return '';
        }
        label = Jam.t(label, game);
        return this.resolveTemplate(template, {label, value});
    }

    stringifyOptionValue (value) {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'boolean') {
            return Jam.t(value);
        }
        return value;
    }
};