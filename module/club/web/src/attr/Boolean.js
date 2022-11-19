/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.FormBoolean = class FormBoolean extends Club.FormAttr {

    init () {
        super.init();
        this.$checkbox = this.find('[type="checkbox"]');
        this.$checkbox.prop('checked', this.$value.val() === 'true');
        this.$checkbox.change(this.onChangeCheckbox.bind(this));
    }

    onChangeCheckbox () {
        this.setValue(this.$checkbox.is(':checked'));
    }

    setValue (value) {
        super.setValue(value);
        this.$checkbox.prop('checked', value);
    }

    toggleDisabled (state) {
        state
            ? this.$checkbox.attr('disabled', true)
            : this.$checkbox.removeAttr('disabled');
    }
};