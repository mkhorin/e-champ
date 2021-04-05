/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.MotionElement = class MotionElement {

    constructor (config) {
        this.element = config.element;
        this.target = config.target; // offset
        this.source = config.source; // offset
        this.duration = config.duration;
        this.delay = config.delay || 0;
        this.speed = config.speed;
        this.motion = config.motion;
        this.deferred = $.Deferred();
    }

    done () {
        return this.deferred.done(...arguments);
    }

    start () {
        if (this.source) {
            Club.setElementOffset(...this.source, this.element);
            return setTimeout(this.execute.bind(this), 0);
        }
        this.execute();
    }

    execute () {
        const duration = this.getDuration();
        this.element.classList.add('in-motion');
        this.element.style.transitionDuration = `${duration}s`;
        this.element.style.transitionDelay = `${this.delay}s`;
        Club.setElementOffset(...this.target, this.element);
        setTimeout(this.onFinish.bind(this), (duration + this.delay) * 1000 + 10);
    }

    getDuration () {
        return this.speed !== undefined
            ? this.getDurationBySpeed()
            : this.duration;
    }

    getDurationBySpeed () {
        const [tx, ty] = this.target;
        const dx = tx - this.element.offsetLeft;
        const dy = ty - this.element.offsetTop;
        const nx = Math.abs(dx / this.speed);
        const ny = Math.abs(dy / this.speed);
        return (nx > ny ? nx : ny) / 10;
    }

    onFinish () {
        this.element.classList.remove('in-motion');
        this.element.style.transitionDuration = '';
        this.element.style.transitionDelay = '';
        this.motion.remove(this);
        this.deferred.resolve(this.element);
        this.motion.resolveEndHandlers();
    }
};