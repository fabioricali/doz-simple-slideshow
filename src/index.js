import Doz from 'doz'
import he from 'he'

const SEPARATOR = '{$' + Date.now() + '$}';

Doz.use(function (Doz) {
    Doz.mixin({
        slideDeserialize(str) {
            return he.decode(str)
        },
        slideSerialize(str) {

            if (Array.isArray(str))
                str = Object.assign([], str).join(SEPARATOR);

            return he.encode(str, {
                allowUnsafeSymbols: true
            });
        }
    });
});

export default class extends Doz.Component {

    constructor(o) {
        super(o);

        this.props = {
            items: [],
            delay: '4s',
            duration: '1s',
            state: 'running'
        };

        this.propsConvert = {
            items: (v) => {
                if (typeof v === 'string') {
                    v = v.split(SEPARATOR);
                }
                this.canStart();
                return v;
            }
        };
    }

    canStart() {
        this.props.state = this.props.items.length <= 1 ? 'paused' : 'running';
    }

    template(h) {
        return h`

            <style> 
                .items-list {
                    position: relative;
                    margin: 0;
                    padding: 0;
                }
                
                .items-list li {
                    position: absolute;
                    padding: 0;
                    margin: 0;
                    list-style: none;
                    left: 0;
                    top: 0;
                }

                .items-list li:nth-of-type(1) {
                    animation-name: fadeOut;
                    animation-delay: ${this.props.delay};
                    animation-duration: ${this.props.duration};
                    animation-play-state: ${this.props.state};
                    z-index: 2;
                }
                
                .items-list li:nth-of-type(2) {
                    opacity: 0;
                    animation-name: fadeIn;
                    animation-delay: ${this.props.delay};
                    animation-duration: ${this.props.duration};
                    animation-play-state: ${this.props.state};
                }
                
                .items-list li:nth-of-type(n+3) {
                    display: none;
                }
                
                @keyframes fadeIn {
                    from {opacity: 0;}
                    to   {opacity: 1;}
                }
                
                @keyframes fadeOut {
                    from {opacity: 1;}
                    to   {opacity: 0;}
                }
            </style>
            
            <ul d-ref="itemsList" class="items-list"> 
                ${this.each(this.props.items, (item, i) => `
                    <li d-ref="item${i}" forceupdate onanimationstart="this.animationStart()" onanimationend="this.animationEnd()">
                        ${this.slideDeserialize(item)}
                    </li>
                `)}
            </ul>
        `
    }

    animationStart() {
        this.canStart();
    }

    animationEnd(e) {
        // Reassign items array only if target is first
        try {
            if (e.target.parentNode.children[0] !== e.target) return;
            let tmp = Object.assign([], this.props.items);
            tmp.push(tmp.shift());
            this.props.items = tmp;
        } catch (e) {
        }
    }
};