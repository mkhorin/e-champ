/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.FormAttr = class FormAttr extends Club.Element {

    init () {
        this.$value = this.find('[name]');
        this.form = this.getClosestHandler(Club.Form);
        this.form.on('clear', this.clear.bind(this));
        this.setFromStorage();
    }

    clear () {
        this.setFromStorage();
    }

    getValue () {
        return this.$value.val();
    }

    setValue (value) {
        this.$value.val(value);
    }

    clearErrors () {
        this.$container.removeClass('has-error');
    }

    setFromStorage () {
        if (this.getStorageKey()) {
            this.setValue(Jam.localStorage.get(this.getStorageKey()));
        }
    }

    setToStorage () {
        if (this.getStorageKey()) {
            Jam.localStorage.set(this.getStorageKey(), this.getValue());
        }
    }

    getStorageKey () {
        return this.$value.data('storageKey');
    }

    validate () {
        this.setToStorage();
    }

    toggleDisabled (state) {
        state ? this.$value.attr('disabled', true) : this.$value.removeAttr('disabled');
    }
};