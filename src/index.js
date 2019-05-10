import {Component} from "doz";

export default class extends Component {

    constructor(o) {
        super(o);

        this.props = {
            images: []
        };

        this._imagesDataUri = {};

        this.propsConvert = {
            images(v) {
                if (Array.isArray(v)) {
                    /*if(/^http/.test(img.src)) {
                        this._getDataUri(img.src).then(dataUri => {
                            //this.props.images[i] = dataUri;
                        })
                    }*/

                    return v;
                } else if (typeof v === 'string') {
                    return v.split('|');
                }
            }
        };

        this.propsListenerAsync = {
            images: () => {
                Array.from(this.ref.imageList.getElementsByTagName('img')).forEach((img, i) => {
                    /*if(/^http/.test(img.src)) {
                        this._getDataUri(img.src).then(dataUri => {
                            //this.props.images[i] = dataUri;
                        })
                    }*/
                    //document.body.appendChild(img.cloneNode())
                });

            }
        };
    }

    template(h) {
        return h`

            <style> 
                .image-list {
                    position: relative;
                }
                
                .image-list a {
                    position: absolute;
                }

                .image-list a:nth-of-type(1) {
                    animation-name: fader;
                    animation-delay: 4s;
                    animation-duration: 1s;
                    z-index: 20;
                }
                
                .image-list a:nth-of-type(2) {
                    z-index: 10;
                }
                
                .image-list a:nth-of-type(n+3) {
                    display: none;
                }
                
                @keyframes fader {
                    from { opacity: 1.0; }
                    to   { opacity: 0.0; }
                }
            </style>
            
            <div d-ref="imageList" class="image-list"> 
                ${this.each(this.props.images, image => `
                    <a forceupdate onanimationend="this._fadeComplete()">
                        <img class="lazy" src="${image}">
                    </a>
                `)}
            </div>
        `
    }

    onMountAsync() {
        //this.props.images.forEach(imageUrl => {
           /*this._getDataUri(imageUrl, dataUri => {
               this._imagesDataUri[imageUrl] = dataUri;
           })

            */
           /*const img = document.createElement('img');
           img.src = imageUrl;
        });*/
    }

    _fadeComplete() {
        let tmp = Object.assign([], this.props.images);
        tmp.push(tmp.shift());
        this.props.images = tmp;
    }

    _getDataUri(url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous';

            image.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;

                canvas.getContext('2d').drawImage(this, 0, 0);

                resolve(canvas.toDataURL('image/png'));
            };

            image.onerror = function(e) {
                reject(e)
            };

            image.src = url;
        });

    }
};