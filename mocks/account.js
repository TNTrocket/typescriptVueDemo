import Mock from 'mockjs'

Mock.mock(/ntce-c\/user\/login/, 'post', function (options) {
    return Mock.mock({
            "code": 10000,
            "msg": "ok",
            "data": {
                token : 'x',      // 后续接口验证身份用
                uid: "x",			  // 用户id
                avatarUrl: 'x',	  // 用户头像URL
                nickname: 'x',    // 用户昵称，如果有
                'isNew':'Y' //是否首次获取  Y-首次，N-非首次
            }
        }
    )
});


Mock.mock(/ntce-c\/TKT\/answerList/, 'post', function (options) {
    return Mock.mock({
            "code": 10000,
            "msg": "ok",
            "data": {
                batchId: 'x',//批次号
                status:'x', //进度
                total:'x',  //总数
                answerlist: [{
                    'type': '0',	//类别 0-错词复习，1-新单词
                    'answers|10': [{
                        'module': "module1",		 //module1、module2、module3……
                        'currectOption': 'A', //正确答案
                        'word': '纷纷', //单词
                        'finalOption':'C', //最终选择答案  可能为空，为空则是没有做
                        'phonogram':'[xxx]',//音标
                        'wordId':'@id', //题目ID
                         'pos':'adj.',
                        'questionId':'@id',
                        'currectOptionId':"@id",
                        'options':[
                            {'option':'A','meaning':'fefefe','wordId':'123'}, //选项A
                            {'option':'B','meaning':'fewww','POS':'adj.','wordId':'123'}, //选项B
                            {'option':'C','meaning':'gg','POS':'adj.','wordId':'123'}, //选项C
                            {'option':'D','meaning':'jj','POS':'adj.','wordId':'123'}, //选项D
                        ]
                    }
                    ],
                },{
                    'type': '1',
                    'answers|10': [{
                        'module': 'module2',
                        'currectOption': 'A',
                        'pos':'adj.',
                        'word': 'xx', //单词
                        'phonogram':'[xxx]',//音标
                        'questionId':'@id', //题目ID
                        'currectOptionId':"@id",
                        'options':[
                            {'option':'A','meaning':'飞飞飞','POS':'adj.','wordId':'123'},
                            {'option':'B','meaning':'x','POS':'adj.','wordId':'123'},
                            {'option':'C','meaning':'x','POS':'adj.','wordId':'123'},
                            {'option':'D','meaning':'x','POS':'adj.','wordId':'123'},
                        ]
                    }
                    ],
                }],
            }
        }
    )
});