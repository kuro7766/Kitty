angular.module('kityminderDemo', ['kityminderEditor'])
    .controller('MainController', ['$scope', '$http', function ($scope, $http) {
        $scope.initEditor = function (editor, minder) {
			return;
            window.editor = editor;
            window.minder = minder;
            const url = window.location;
            window.file_lock=0;
            window.inited=false;
            

            // window.onbeforeunload=function(e){     　　var e = window.event||e;  　　e.returnValue=("确定离开当前页面吗？");}

            var header = document.getElementById('scrolldiv');

            var pictureButton = document.getElementById('my_picture_button');
            function onerr(){

                document.getElementById('main_title').innerText = '❗';
            }

            function synchronize(){
                document.getElementById('main_title').innerText = '🔄';
                var json_str=get('json');
                var json1=JSON.parse(json_str);
                json1['file_lock']=window.file_lock;
                json_str=JSON.stringify(json1);
                $http({
                    url: 'http://kuroweb.cf/redirect/kmapi',           //请求的url路径
                    method: "POST",     //GET/DELETE/HEAD/JSONP/POST/PUT
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    // params:{
                    //     't':new Date().getTime()
                    // },
                    // params: {
                    //     'type': 'upload', 'data': json2b64({
                    //         'id': initParamDict['id'],
                    //         'path': decode(initParamDict['path']),
                    //         'json_str': (get('json'))
                    //     })
                    // },    //转为  ?param1=xx1¶m2=xx2的形式

                    data: {
                        'type': 'upload', 'data': json2b64({
                            'id': initParamDict['id'],
                            'path': decode(initParamDict['path']),
                            'json_str': (json_str),
                            'file_lock':window.file_lock
                        })
                    }         //包含了将被当做消息体发送给服务器的数据，通常在POST请求时使用
                }).then(
                    function success(resq) {
                        //响应成功的处理方法体
                        // console.log('success!!!!' + JSON.stringify(resq));
                        // console.log(JSON.parse(decode(resq.data))['data']);

                        document.getElementById('main_title').innerText = '✅💚';
                        console.log('saved')
                    }, function error(resq) {
                        //响应错误的处理方法体
                        document.getElementById('main_title').innerText = '❗';
                        console.log('fail' + resq);
                    });
            }


            function initPlugin() {
                pictureButton.onclick = function () {

                    $http({
                        url: 'http://kuroweb.cf/redirect/myapi/2280315050?type=recentpictures',           //请求的url路径
                        method: "GET",     //GET/DELETE/HEAD/JSONP/POST/PUT
                        params: {},    //转为  ?param1=xx1¶m2=xx2的形式
                        // data: data         //包含了将被当做消息体发送给服务器的数据，通常在POST请求时使用
                    }).then(
                        function success(resq) {
                            //响应成功的处理方法体
                            // console.log('success!!!!' + JSON.stringify(resq));
                            // console.log(JSON.parse(decode(resq.data))['data']);

                            var j = (resq.data);
                            window.ppic = (j[0]['url']);
                            //alert(JSON.stringify(response));
                            //document.getElementsByClassName('btn btn-default image-btn')[0].click();
                            minder.execCommand('image', window.ppic);
                            setTimeout(function(){
                                synchronize();
                            },3000);
                            setTimeout(function(){
                                synchronize();
                            },10000);
                        }, function error(resq) {
                            //响应错误的处理方法体
                            document.getElementById('main_title').innerText = '❗';
                            console.log('fail' + resq);
                        });

                }

                function setCheckBox(index, checked) {
                    var cb = document.getElementById('cbx_me_' + index);
                    if (cb) {
                        cb.checked = checked;
                    }
                }

                var rootNode;
                var all_tags = [];
                var i = 0;

                function regenerate_tags() {
                    for (i = 0; i < all_tags.length; i++) {
                        var lb = document.getElementById('label_me_' + i);
                        lb.remove();
                        console.log('removing...' + i);
                    }
                    all_tags = [];
                    var c = document.querySelector("#resource-dropdown > ul").children;
                    for (var i = 0; i < c.length; i++) {
                        all_tags.push(c[i].innerText.trim());
                    }
                    //all_tags.push('new');
                    var current_tags = minder.queryCommandValue('Resource');


                    for (i = 0; i < all_tags.length; i++) {
                        var x = $('<label id="label_me_' + i + '"><input class="my_checkbox" type="checkbox"  name="sex" value="男生" id="cbx_me_' + i + '"> <span class="white_color">' + all_tags[i] + '</span></label>');
                        // todo : change this header
                        x.appendTo(header);
                        var checkbox = document.getElementById('cbx_me_' + i);

                        var hasEqual = false;
                        for (var j in current_tags) {
                            var ele = current_tags[j];
                            console.log('ele...' + ele);
                            console.log('current_i...' + all_tags[i]);
                            if (ele === all_tags[i]) {
                                hasEqual = true;
                                setCheckBox(i, true);
                            }
                        }
                        console.log('hasEqual' + hasEqual);
                        if (!hasEqual) {
                            setCheckBox(i, false);
                        }

                        const mi = i;
                        checkbox.addEventListener('change', function () {
                            if (this.checked) {
                                var lb = document.getElementById('label_me_' + mi);
                                console.log("Checkbox is checked.." + lb.innerText);
                                const value = minder.queryCommandValue('Resource');
                                console.log('m_value' + JSON.stringify(value));
                                console.log('will_insert...' + lb.textContent);
                                var contain = false;
                                for (var i in value) {
                                    var ele = value[i];
                                    console.log(ele);
                                    if (ele === lb.textContent.trim()) {
                                        contain = true;
                                    }
                                }
                                if (!contain) {
                                    value.push(lb.textContent.trim());
                                }
                                minder.execCommand('Resource', value);
                            } else {
                                var lb2 = document.getElementById('label_me_' + mi);
                                console.log("Checkbox is checked.." + lb2.innerText);
                                const value = minder.queryCommandValue('Resource');
                                console.log('m_value' + JSON.stringify(value));
                                console.log('will_insert...' + lb2.textContent);
                                var contain2 = false;
                                for (var i1 in value) {
                                    var ele1 = value[i1];
                                    console.log(ele1);
                                    if (ele1 === lb2.textContent.trim()) {
                                        contain2 = true;
                                    }
                                }
                                var c = [];
                                if (contain2) {
                                    c = value.filter(function (x) {
                                        return x !== lb2.textContent.trim();
                                    });
                                    console.log(c);
                                }
                                minder.execCommand('Resource', c);
                            }
                        });
                    }
                    window.scrollWidget.scrollLeft=window.scroll_position;
                }

                setTimeout(() => {
                    regenerate_tags();
                }, 3000);

                minder.on('selectionchange', function () {
                    var rootNode = minder.getSelectedNode();
                    if (rootNode) {
                        regenerate_tags();
                    }
                });
                minder.on('interactchange', function () {
                    regenerate_tags();
                });

            }

            initPlugin();

            function simple(text) {
                return JSON.stringify({
                    "root": {"data": {"id": "0", "created": 0, "text": text}, "children": []},
                    "template": "default",
                    "theme": "classic-compact",
                    "version": "1.4.43"
                });
            }

            // console.log(url);
            /**
             * minder.importData('json',JSON.stringify({"root":{"data":{"id":"c8ogn4jegio0","created":1611194102602,"text":"改造","resource":[],"progress":null,"image":"http://kuroweb.cf/picture/wrong.png","imageTitle":"","imageSize":{"width":200,"height":112},"priority":null},"children":[{"data":{"id":"c8ogojuh1bs0","created":1611194214287,"text":"what is this"},"children":[]},{"data":{"id":"c8ohaq37bg00","created":1611195951887,"text":"分支主题","expandState":"expand"},"children":[{"data":{"id":"c92ybqvn8000","created":1612665830233,"text":"分支主题"},"children":[]}]},{"data":{"id":"c92dx39wl8g0","created":1612608259556,"text":"分支主题","hyperlink":"https://github.com/fex-team/kityminder-core/wiki","hyperlinkTitle":""},"children":[]}]},"template":"default","theme":"fresh-blue","version":"1.4.43"}),{})
             * @param minderJsonString
             */
            function set(minderJsonString) {
                window.minder.importData('json', minderJsonString, {});
                document.title = JSON.parse(minderJsonString)['root']['data']['text'];
            }

            set(simple('加载中...'))
            const paramString = url.search;

            var initParamDict = {};
            var params = paramString.split(/[&?]/g);
            //console.log(params);
            //console.log(params[2].indexOf('='));
            params = params.filter(function (x) {
                return x.length !== 0;
            })
            for (var i = 0; i < params.length; i++) {
                var spliter=params[i].indexOf('=');
                var key=params[i].slice(0,spliter);
                var value=params[i].slice(spliter+1);
                console.log(key+','+value);
                initParamDict[key] = value;
            }

            console.log(JSON.stringify(initParamDict));
            //console.log(paramDict);
            // json - JSON 字符串，支持导入和导出
            // svg - SVG 矢量格式，仅支持导出
            function get(protocol) {
                // console.log(window.minder);
                return window.minder.exportData(protocol, {}).fulfillValue;
            }

            //字符串转base64
            function encode(str) {
                // 对字符串进行编码
                var encode = encodeURI(str);
                // 对编码的字符串转化base64
                var base64 = btoa(encode);
                return base64;
                // var base = new Base64();
                // return base.encode(strUnicode2Ansi(str));
                // return BASE64.urlsafe_encode(str);
            }

            // base64转字符串
            function decode(base64) {
                // // 对base64转编码
                // var decode = atob(base64);
                // // 编码转字符串
                // var str = decodeURI(decode);
                // return str;
                // var base = new Base64();
                // return strAnsi2Unicode(base.decode(base64));
                return BASE64.decode(base64);//url-safe Base64解码
            }

            function json2b64(j) {
                // console.log(JSON.stringify(j));

                return encode((JSON.stringify(j)));
            }

            function b642json(s) {
                return JSON.parse(decode(s))
            }

            function jumpInit(){
                if( initParamDict['jumpto']){
                    var node=minder.getNodeById(initParamDict['jumpto']);
                    if(node){
                        minder.execCommand('Camera', node, 1000);
                    }
                }
            }

            //init your code
            function getMinderKey(){
                // do something
                $http({
                    url: 'http://kuroweb.cf/redirect/kmapi',           //请求的url路径
                    method: "GET",     //GET/DELETE/HEAD/JSONP/POST/PUT
                    params: {
                        'type': 'getkey', 'data': json2b64({
                            'id': initParamDict['id'],
                            'path': decode(initParamDict['path'])
                        }),'t':new Date().getTime()
                    }, 
                    // data: data         //包含了将被当做消息体发送给服务器的数据，通常在POST请求时使用
                }).then(
                    function success(resq) {
                        //响应成功的处理方法体
                        // console.log('success!!!!' + JSON.stringify(resq));
                        // console.log(JSON.parse(decode(resq.data))['data']);

                        var j = JSON.parse(decode(resq.data));
                        // console.log(j);
                        window.file_lock=j['file_lock'];
                        document.getElementById('main_title').innerText = '✅🔑';
                        if (window.inited){

                        }else{
                            window.inited=true;
                            $http({
                                url: 'http://kuroweb.cf/redirect/kmapi',           //请求的url路径
                                method: "GET",     //GET/DELETE/HEAD/JSONP/POST/PUT
                                params: {
                                    'type': 'download', 'data': json2b64({
                                        'id': initParamDict['id'],
                                        'path': decode(initParamDict['path'])
                                    }),'t':new Date().getTime()
                                },    //转为  ?param1=xx1¶m2=xx2的形式
                                // data: data         //包含了将被当做消息体发送给服务器的数据，通常在POST请求时使用
                            }).then(
                                function success(resq) {
                                    //响应成功的处理方法体
                                    // console.log('success' + JSON.stringify(resq));
                                    //console.log(JSON.parse(decode(resq.data))['data']);
                                    console.log('java script start');
                                    set(JSON.parse(decode(resq.data))['data']);
                
                                    document.getElementById('main_title').innerText = '✅💚';
                                    
                                    
                                    setTimeout(() => {
                                        jumpInit();
                                        
                                    }, 500);
                                    
                                    setTimeout(() => {
                                        window.minder.on('contentchange', function (e) {
                                            // console.log(get('json'));
                                            if(window.file_lock){
                                                synchronize();
                                            }
                                        });
                                    }, 2000);
                                    
                
                                }, function error(resq) {
                                    //响应错误的处理方法体
                
                                    console.log('fail' + resq);
                                });
                        }
                    }, function error(resq) {
                        //响应错误的处理方法体
                        document.getElementById('main_title').innerText = '❗';
                        console.log('getkey error,' + resq);
                    });

                setTimeout(() => {
                    getMinderKey();
                }, 250000);
            }

            getMinderKey();
            

            console.log('path is :'+decode(initParamDict['path']));
            console.log({
                'id': initParamDict['id'],
                'path': decode(initParamDict['path'])
            });


            // window.minder.on('selectionchange', function (e) {
            //     var node = minder.getSelectedNode();
            //     if (node) {
            //         console.log('You selected: "%s" | %s', node.getText(), e.toString());
            //     }
            // });
            // window.minder.on('command', function (e) {
            //     console.log("command | " + e.toString());
            // });

            // window.minder.on('interactchange', function (e) {
            //     console.log("interactchange | " + e.toString());
            // });
        };
    }]);