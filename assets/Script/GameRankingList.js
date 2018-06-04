cc.Class({
    extends: cc.Component,
    properties: {
        UserItem: cc.Prefab,
        Rank1Item: cc.Prefab,
        Rank2Item: cc.Prefab,
        Rank3Item: cc.Prefab,
        rankingScrollView: cc.Node,
        scrollViewContent: cc.Node,
        prefabRankItem: cc.Prefab,
        loadingLabel: cc.Node,//加载文字
    },
    onLoad : function(){
        if (wx != undefined) {
            wx.onMessage(data => {
                cc.log("接收主域发来消息：", data)
                if (data.messageType == 0) {//移除排行榜
                    this.removeChild();
                } else if (data.messageType == 1) {//获取好友排行榜
                    this.node.active = 1;
                    this.fetchFriendData(data.MAIN_MENU_NUM);
                } else if (data.messageType == 3) {//提交得分
                    this.submitScore(data.MAIN_MENU_NUM, data.score);
                } 
            });
        } else {
            this.fetchFriendData(1000);
        }
        this.node.active = 0;
    },
    start() {
        //this.fetchFriendData(1000);
    },
    submitScore(MAIN_MENU_NUM, score) { //提交得分
        if (window.wx != undefined) {
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [MAIN_MENU_NUM],
                success: function (getres) {
                    console.log('getUserCloudStorage', 'success', getres)
                    if (getres.KVDataList.length != 0) {
                        if (getres.KVDataList[0].value > score) {
                            return;
                        }
                    }
                    // 对用户托管数据进行写数据操作
                    window.wx.setUserCloudStorage({
                        KVDataList: [{key: MAIN_MENU_NUM, value: "" + score}],
                        success: function (res) {
                            console.log('setUserCloudStorage', 'success', res)
                        },
                        fail: function (res) {
                            console.log('setUserCloudStorage', 'fail')
                        },
                        complete: function (res) {
                            console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail: function (res) {
                    console.log('getUserCloudStorage', 'fail')
                },
                complete: function (res) {
                    console.log('getUserCloudStorage', 'ok')
                }
            });
        } else {
            cc.log("提交得分:" + MAIN_MENU_NUM + " : " + score)
        }
    },
    removeChild() {
        this.node.removeChildByTag(1000);
        this.rankingScrollView.active = false;
        this.scrollViewContent.removeAllChildren();
        this.loadingLabel.string = "玩命加载中...";
        this.loadingLabel.active = true;
    },
    fetchFriendData(MAIN_MENU_NUM) {
        this.removeChild();
        var _this = this;
        this.rankingScrollView.active = true;
        if (window.wx != undefined) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    this.loadingLabel.active = false;
                    console.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: ["score"],
                        success: res => {
                            console.log("wx.getFriendCloudStorage success", res);
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            
                            for (let i = 0; i < data.length; i++) {
                                var playerInfo = data[i];

                                if(i == 0){
                                    let item = cc.instantiate(_this.Rank1Item);
                                    item.getComponent('Rank1Item').init(i, playerInfo);
                                    _this.node.addChild(item);
                                    continue;
                                }

                                if(i == 1){
                                    let item = cc.instantiate(_this.Rank2Item);
                                    item.getComponent('Rank2Item').init(i, playerInfo);
                                    _this.node.addChild(item);
                                    continue;
                                }

                                if(i == 2){
                                    let item = cc.instantiate(_this.Rank3Item);
                                    item.getComponent('Rank2Item').init(i, playerInfo);
                                    _this.node.addChild(item);
                                    continue;
                                }

                                if(i>=7){
                                    continue;
                                }

                                var item = cc.instantiate(_this.prefabRankItem);
                                item.getComponent('RankItem').init(i, playerInfo);
                                _this.scrollViewContent.addChild(item);
                                
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    if(i >= 7){
                                        let userItem = cc.instantiate(_this.UserItem);
                                        userItem.getComponent('UserItem').init(i, playerInfo);
                                        _this.rankingScrollView.addChild(userItem);
                                        break;
                                    }
                                }

                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                },
                fail: (res) => {
                    this.loadingLabel.string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    },
    close : function(){
        this.node.active = 0;
    }
});
