/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.Countdown = class Countdown {

    constructor (params) {
        this.$element = params.$element;
        this.refreshInterval = params.refreshInterval;
    }

    clear () {
        clearTimeout(this.timer);
        this.timeout = 0;
        this.draw();
    }

    start (timeout, timestamp = Date.now()) {
        this.clear();
        this.timeout = timeout;
        this.endTime = timestamp + timeout;
        this.draw();
        this.run();
    }

    run () {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.execute.bind(this), this.refreshInterval);
        this.draw();
    }

    execute () {
        this.getValue() > 0 ? this.run() : this.draw();
    }

    getValue () {
        return this.timeout ? this.endTime - Date.now() : 0;
    }

    draw () {
        const rest = this.timeout
            ? Math.ceil(this.getValue() * 100 / this.timeout)
            : 100;
        this.$element.css('--rest', (rest < 0 ? 0 : rest) + '%');
    }
};

Club.CircularCountdown = class CircularCountdown extends Club.Countdown {

    draw () {
        let current = 0;
        let value = this.getValue();
        if (!this.timeout) {
            current = 360;
        } else if (value > 0) {
            current = Math.round(value * 360 / this.timeout);
        }
        if (current > 180) {
            current = 360 - current;
            this.$element.removeClass('less-half');
        } else {
            current = 180 - current;
            this.$element.addClass('less-half');
        }
        this.$element.css('--rest', current + 'deg');
    }
};