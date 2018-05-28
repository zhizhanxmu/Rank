// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node,
        rank1: {
            default: null,
            type: cc.Node
        },
        rank1Name: {
            default: null,
            type: cc.Node
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let sharedCanvas = wx.getSharedCanvas()
        let context = sharedCanvas.getContext('2d')
        context.fillStyle = 'red'
        context.fillRect(0, 0, 100, 100)

        console.log(sharedCanvas)

        var kvDataList = new Array();
        kvDataList.push({
            key: "score",
            value: "111"
        });
        wx.setUserCloudStorage({
            KVDataList: kvDataList
        })

        var _this = this
        wx.getFriendCloudStorage({
            keyList: ['score'],
            success: function (res) {
                console.log(res);
                let uesrName = res.data[0].nickname
                let uesrPhoto = res.data[0].avatarUrl
                console.log(uesrName);
                console.log(uesrPhoto);
                _this.rank1Name.getComponent(cc.Label).string = uesrName;
                /*_this.rank1.getComponent(cc.Sprite).spriteFrame.setTexture(uesrPhoto);*/
                var image = wx.createImage()
                image.src = uesrPhoto
                console.log(image)
                 _this.rank1.getComponent(cc.Sprite).spriteFrame = image
                /*cc.loader.load({url: "image.src", type: 'jpg'}, function (err, texture) {
                    if (err) {
                        cc.log(err);
                    }
                    _this.rank1.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                });*/
           //TODO:进行数据绑定更新
            }
        });

        /*wx.onMessage(data => {
        switch (data.message) {
            case 'Show':
                this._show();
                break;
            case 'Hide':
                this._hide();
                break;
        }
        });*/
    },
    /*_show() {
        let moveTo = cc.moveTo(0.5, 0, 0);
        this.display.runAction(moveTo);
        console.log('i show');
        var kvDataList = new Array();
        kvDataList.push({
            key: "score",
            value: "111"
        });
        wx.setUserCloudStorage({
            KVDataList: kvDataList
        })

        wx.getFriendCloudStorage({
            keyList: ['score'],
            success: function (res) {
                console.log(res);
           //TODO:进行数据绑定更新
            }
        });
},*/
/*_hide() {
    let moveTo = cc.moveTo(0.5, 0, 1000);
    this.display.runAction(moveTo);
},*/
    // update (dt) {},
});
