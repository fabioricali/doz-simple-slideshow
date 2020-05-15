import Doz from 'doz'

const SEPARATOR = '{$%' + Date.now() + '%$}';

Doz.mixin({
    slideSerialize(str) {

        if (Array.isArray(str))
            str = Object.assign([], str).join(SEPARATOR);

        return btoa(str);
    }
});

export default class extends Doz.Component {

    constructor(o) {
        super(o);

        this._innerMode = false;

        this.props = {
            items: [],
            delay: '5s',
            duration: '1s',
            state: 'running'
        };

        this.propsConvert = {
            items: (v) => {
                if (typeof v === 'string' && !this._innerMode) {
                    v = atob(v);
                    v = v.split(SEPARATOR);
                }

                return v;
            }
        };

        this.propsListenerAsync = {
            items: () => {
                this.canStart();
            }
        }
    }

    canStart() {
        this.props.state = this.props.items.length <= 1 ? 'paused' : 'running';
    }

    template(h) {
        return h`

            <style> 
                * {
                    box-sizing: border-box;
                }
                
                .items-list {
                    position: relative;
                    margin: 0;
                    padding: 0;
                    transition: all 300ms;
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
                ${this.each(this.props.items, (item, i) => h`
                    <li d-ref="item${i}" forceupdate 
                        onanimationstart="this.animationStart()" 
                        onanimationend="this.animationEnd()">
                        ${this.deSanitize(item)}
                    </li>
                `)}
            </ul>
        `
    }

    _tryToSetInitialHeight() {
        if (window.__DOZ_SSR_PATH__) return;

        if (!this.ref.item0.offsetParent) {
            window.requestAnimationFrame(() => this._tryToSetInitialHeight());
        } else {
            this.ref.itemsList.style.height = this.ref.item0.offsetHeight + 'px';
        }
    }

    onMount() {
        this.loadFromInner();
    }

    loadFromInner() {
        let possibleChildNodes = Array.from(this.getHTMLElement().children);
        if (possibleChildNodes.length === 1) return;

        this._innerMode = true;

        this.prepareCommit();
        this.props.items = [];
        for (let i = 0; i < possibleChildNodes.length - 1; i++) {
            let $child = possibleChildNodes[i];
            this.props.items.push($child.outerHTML);
            $child.style.display = 'none';
            $child.style.visibility = 'hidden';
            $child.style.position = 'absolute';
            $child.style.left = '-9999px';
            $child.style.top = '-9999px';
        }
        this.commit();
    }

    onMountAsync() {
        if (this.ref.item0)
            this._tryToSetInitialHeight();
    }

    deSanitize(str) {
        str = str
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');
        return str
    }

    animationStart() {
        if (this.ref.item1)
            this.ref.itemsList.style.height = this.ref.item1.offsetHeight + 'px';
        this.canStart();
        //console.log('animation')
    }

    animationEnd(e) {
        // Reassign items array only if target is the first, the second is the next
        try {
            if (e.target.parentNode.children[0] !== e.target) return;
            let tmp = Object.assign([], this.props.items);
            tmp.push(tmp.shift());
            this.props.items = tmp;
            console.log(tmp)
        } catch (e) {
        }
    }
};