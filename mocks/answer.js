import Mock from 'mockjs'

Mock.mock(/ntce-c\/TKT\/feedbackList/, 'post', function (options) {
    return Mock.mock({
            "code": 10000,
            "msg": "ok",
            "data": {
                token : 'x',      // 后续接口验证身份用
                uid: "efe",			  // 用户id
                avatarUrl: 'x',	  // 用户头像URL
                nickname: 'x',    // 用户昵称，如果有
                'isNew':'Y' //是否首次获取  Y-首次，N-非首次
            }
        }
    )
});



Mock.mock(/ntce-c\/TKT\/TKTOverview/, 'post', function (options) {
    return Mock.mock({
            "code": 10000,
            "msg": "ok",
            "data": {
                'practicedNo':'100', //已练习单词数
                'totalNo':'300',   //总单词数
                'practiced':{
                    'module1':'12/100', //module1:已练习数/未练习数
                    'module2':'x/y',
                    'module3':'x/y'
                },
                'wrongWordNo':'x',
                'wrongWordModules':{
                    'module1':'x','module2':'x','module3':'x'
                }
            }
        }
    )
});


Mock.mock(/ntce-c\/TKT\/moduleOrWrongWordOverview/, 'post', function (options) {
    return Mock.mock({
            "code": 10000,
            "msg": "ok",
            "data": {
                'wordList':{
                    'module':'module1', //module1
                    'practiced|10':[ //已练习单词
                        {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'},
                        {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'},
                        {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'},

                    ],
                    'unpracticed|10':[//未练习单词
                        {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'},
                        {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'},
                        {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'},
                    ],
                },
                'wrongWordList':[  //错词本
                    {'module':'module1', //module1
                        wrongWords:[  //某个module下的错词集合
                            {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'},
                            {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'},
                            {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'}
                        ]
                    },{'module':'module2',
                        wrongWords:[
                            {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'},
                            {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'},
                            {'word':'a','phonogram':'英[xxxx] 美[xxxx]','partOfSpeech':'adj.','meaning':'xxxx'}
                        ]
                    }
                ]
            }
        }
    )
});
