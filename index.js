var express = require('express')
var app = express()
var request = require('request')
var cookieParser = require('cookie-parser')

var scriptAdd = `
function getDomain(url) {
    if ((url.split('/').length - 1) > 2) {
        return url.split('/')[0] + '/' + url.split('/')[1] + '/' + url.split('/')[2];
    }

    return url;
}
async function run() {
    var valueThing = document.getElementById('text3').value
    document.cookie = "website=" + encodeURIComponent(getDomain(valueThing));
    fetch('/proxy', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: valueThing,
            method: 'GET',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Priority": "u=1"
            }
        })
    })
        .then(body => body.text())
        .then(async (body) => {
            console.log(body)
            document.open();
            document.write(body);
            document.close();
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (document.getElementById('topThing') == null) {
                try {
                    var element = document.createElement('div')
                    element.id = 'topThing'
                    element.style = "z-index: 2147483647; position: absolute; top: 0px; left: 50%;"
                    element.innerHTML = '<div style="transform: translateX(-50%); left: 50%; position: absolute; font-size: 25px; top: -56px; background-color: rgba(225,225,225,0.8); height: 125px; width: 320px; border-radius: 20px; text-align: center; font-family: Quicksand, sans-serif; "></div><input type="text" id="text3"  autocomplete="off" placeholder="Search regents exams" style="transform: translateX(-50%); left: 50%; width: 300px; position: absolute; font-size: 25px; top: 20px; outline: none; border: 4px grey solid; border-radius: 40px; text-align: center; font-family: Quicksand, sans-serif; "></input>'
                    document.body.appendChild(element)
                    document.getElementById('text3').value = valueThing
                    document.getElementById('text3').onkeyup = function(e) {
                        if (e.key === 'Enter' || e.keyCode === 13) {
                            run()
                        }
                    }
                } catch(e) {

                }
            }
        })
}
async function onload() {
    await new Promise(resolve => setTimeout(resolve, 4000));
    document.getElementById('text3').onkeyup = function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            run()
        }
    }
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(document.getElementById('topThing'))
        if (document.getElementById('topThing') == null) {
            try {
                var element = document.createElement('div')
                element.id = 'topThing'
                element.style = "z-index: 2147483647; position: absolute; top: 0px; left: 50%;"
                element.innerHTML = '<div style="transform: translateX(-50%); left: 50%; position: absolute; font-size: 25px; top: -56px; background-color: rgba(225,225,225,0.8); height: 125px; width: 320px; border-radius: 20px; text-align: center; font-family: Quicksand, sans-serif;'></div><input type="text" id="text3"  autocomplete="off" placeholder="Search regents exams" style="transform: translateX(-50%); left: 50%; width: 300px; position: absolute; font-size: 25px; top: 20px; outline: none; border: 4px grey solid; border-radius: 40px; text-align: center; font-family: Quicksand, sans-serif;"></input>'
                document.body.appendChild(element)
                document.getElementById('text3').value = oldValue
                document.getElementById('text3').onkeyup = function(e) {
                    if (e.key === 'Enter' || e.keyCode === 13) {
                        run()
                    }
                }
            } catch(e) {
                
            }
        }
        for (var i = 0; i < document.links.length; i++) {
            var url = document.links[i].href
            document.links[i].removeAttribute('href')
            if (document.links[i] != undefined) {
                document.links[i].onclick = function() {
                    window.location.href = url
                }
            }
        }
        var querySelector = document.getElementsByTagName('img')
        for (var i = 0; i < querySelector.length; i++) {
            var object = querySelector[i]

            if (object.src != undefined) {
                if (object.src.includes('http://localhost:3000/proxyGet?url=') || object.src.length == 0) {
                } else {
                    var url = object.src
                    if (url.includes('http://localhost:3000'))  {
                        url = url.replace('http://localhost:3000', 'https://www.google.com')
                    }
                    console.log(url)
                    object.src = 'http://localhost:3000/proxyGet?url=' + encodeURIComponent(url)
                    if (object.srcset != undefined) {
                        object.removeAttribute('srcset')
                    }
                }
            }
        }
        var querySelector1 = document.getElementsByTagName('script')
        for (var i = 0; i < querySelector1.length; i++) {
            var object = querySelector1[i]

            if (object.src != undefined) {
                if (object.src.includes('http://localhost:3000/proxyGet') || object.src.length == 0) {
                } else {
                    var url = object.src
                    if (url.includes('http://localhost:3000'))  {
                        url = url.replace('http://localhost:3000', 'https://www.google.com')
                    }
                    console.log(url)
                    object.src = 'http://localhost:3000/proxyGet?url=' + encodeURIComponent(url)
                    if (object.srcset != undefined) {
                        object.removeAttribute('srcset')
                    }
                }
            }
        }

        console.log('running')
    }    
}
console.warn('working')
onload()`
app.use(cookieParser())
app.use(express.json())
app.post('/proxy', function(req, res) {
    try {
        var proxyData = {
            headers: req.body.headers,
            method: req.body.method,
            encoding: null
        }
        if (req.body.body != undefined) {
            proxyData["body"] = req.body.body
            proxyData["headers"]["Content-Length"] = req.body.body.length
        }
        request(req.body.url, proxyData, function(err2, res2, body2) {
            try {
                for (var key in res2.headers) {
                    res.setHeader(key, res2.headers[key])
                }
                res.status(res2.statusCode).send(Buffer.from(body2, 'binary'))
            } catch(e) {
                res.status(500).send('error')
            }
        })
    } catch(e) {
        res.status(500).send('error')
    }
})

app.use(function(req, res, next) {
    if (req.headers['accept-encoding'] != undefined) {
        req.headers['accept-encoding'] = undefined
    }
    console.log(req.headers)
    try {
        if (req.query.url != undefined) {
            var url = decodeURIComponent(req.query.url)
            req.headers['host']= undefined
            request(url, {
                method: "GET",
                headers: req.headers,
                encoding: null
            }, function(err2, res2, body2) {
                try {
                    for (var key in res2.headers) {
                        res.setHeader(key, res2.headers[key])
                    }
                    if (res2.headers['content-type'].includes('text/html')) {
                        var stringResponse = Buffer.from(body2, 'binary').toString('utf-8')
                        console.log(stringResponse)
                        if (stringResponse.includes('<body')) {
                            var resposnseBuilt = stringResponse.split('<html')[0] + "<html" + stringResponse.split('<html')[1].split('>')[0] + '>' + `<div id="topThing" style="z-index: 2147483647;
                            position: absolute;
                            top: 0px;
                            left: 50%;"><div style="transform: translateX(-50%); left: 50%; position: absolute; font-size: 25px; top: -56px; background-color: rgba(225,225,225,0.8); height: 125px; width: 320px; border-radius: 20px; text-align: center; font-family: 'Quicksand', sans-serif; "></div><input type="text" id="text3" value="${req.cookies.website}" autocomplete="off" placeholder="Search regents exams" style="transform: translateX(-50%); left: 50%; width: 300px; position: absolute; font-size: 25px; top: 20px; outline: none; border: 4px grey solid; border-radius: 40px; text-align: center; font-family: 'Quicksand', sans-serif; "></input></div>` + stringResponse.split("<html" + stringResponse.split('<html')[1].split('>')[0] + '>')[1]
                            if (resposnseBuilt.includes('<head')) {
                                resposnseBuilt.replace("<head", `<head><script type = "text/javascript">' + scriptAdd + "</script>`)
                            } else {
                                if (stringResponse.includes('<html')) {
                                    resposnseBuilt = resposnseBuilt.split('<html')[0] + "<html" + resposnseBuilt.split('<html')[1].split('>')[0] + '>' + '<script type = "text/javascript">' + scriptAdd + "</script>"  + resposnseBuilt.split("<html" + resposnseBuilt.split('<html')[1].split('>')[0] + '>')[1]
                                }
                            }
                            res.status(res2.statusCode).send(resposnseBuilt)
                        } else {
                            if (stringResponse.includes('<html')) {
                                var resposnseBuilt = stringResponse.split('<html')[0] + "<html" + stringResponse.split('<html')[1].split('>')[0] + '>' + `<div id="topThing" style="z-index: 2147483647;
                                position: absolute;
                                top: 0px;
                                left: 50%;"><div style="transform: translateX(-50%); left: 50%; position: absolute; font-size: 25px; top: -56px; background-color: rgba(225,225,225,0.8); height: 125px; width: 320px; border-radius: 20px; text-align: center; font-family: 'Quicksand', sans-serif; "></div><input type="text" id="text3" value="${req.cookies.website}" autocomplete="off" placeholder="Search regents exams" style="transform: translateX(-50%); left: 50%; width: 300px; position: absolute; font-size: 25px; top: 20px; outline: none; border: 4px grey solid; border-radius: 40px; text-align: center; font-family: 'Quicksand', sans-serif; "></input></div>` + stringResponse.split("<html" + stringResponse.split('<html')[1].split('>')[0] + '>')[1]
                                if (resposnseBuilt.includes('<head')) {
                                    resposnseBuilt.replace("<head", `<head><script type = "text/javascript">' + scriptAdd + "</script>`)
                                }
                                resposnseBuilt = resposnseBuilt.split('<html')[0] + "<html" + resposnseBuilt.split('<html')[1].split('>')[0] + '>' + '<script type = "text/javascript">' + scriptAdd + "</script>"  + resposnseBuilt.split("<html" + resposnseBuilt.split('<html')[1].split('>')[0] + '>')[1]
                                res.status(res2.statusCode).send(resposnseBuilt)
                            } else {
                                res.status(res2.statusCode).send(Buffer.from(body2, 'binary'))
                            }                        
                        }                 
                    } else {
                        res.status(res2.statusCode).send(Buffer.from(body2, 'binary'))
                    }
                    res.status(res2.statusCode).send(Buffer.from(body2, 'binary'))
                } catch(e) {
                    try {
                        res.status(500).send('error')
                    } catch(e) {
                    }
                }
            })
        } else {
            console.log(req.headers.referer)
            if (req.cookies.website != undefined && (req.headers.referer != undefined || req.originalUrl != '/')) {
                req.headers['host']= undefined
                request(req.cookies.website + req.originalUrl, {
                    method: "GET",
                    headers: req.headers,
                    encoding: null
                }, function(err2, res2, body2) {
                    try {
                        for (var key in res2.headers) {
                            res.setHeader(key, res2.headers[key])
                        }
                        if (res2.headers['content-type'].includes('text/html')) {
                            var stringResponse = Buffer.from(body2, 'binary').toString('utf-8')
                            console.log(stringResponse)
                            if (stringResponse.includes('<body')) {
                                var resposnseBuilt = stringResponse.split('<html')[0] + "<html" + stringResponse.split('<html')[1].split('>')[0] + '>' + `<div id="topThing" style="z-index: 2147483647;
                                position: absolute;
                                top: 0px;
                                left: 50%;"><div style="transform: translateX(-50%); left: 50%; position: absolute; font-size: 25px; top: -56px; background-color: rgba(225,225,225,0.8); height: 125px; width: 320px; border-radius: 20px; text-align: center; font-family: 'Quicksand', sans-serif; "></div><input type="text" id="text3" value="${req.cookies.website}" autocomplete="off" placeholder="Search regents exams" style="transform: translateX(-50%); left: 50%; width: 300px; position: absolute; font-size: 25px; top: 20px; outline: none; border: 4px grey solid; border-radius: 40px; text-align: center; font-family: 'Quicksand', sans-serif; "></input></div>` + stringResponse.split("<html" + stringResponse.split('<html')[1].split('>')[0] + '>')[1]
                                if (resposnseBuilt.includes('<head')) {
                                    resposnseBuilt.replace("<head", `<head><script type = "text/javascript">' + scriptAdd + "</script>`)
                                } else {
                                    if (stringResponse.includes('<html')) {
                                        resposnseBuilt = resposnseBuilt.split('<html')[0] + "<html" + resposnseBuilt.split('<html')[1].split('>')[0] + '>' + '<script type = "text/javascript">' + scriptAdd + "</script>"  + resposnseBuilt.split("<html" + resposnseBuilt.split('<html')[1].split('>')[0] + '>')[1]
                                    }
                                }
                                res.status(res2.statusCode).send(resposnseBuilt)
                            } else {
                                if (stringResponse.includes('<html')) {
                                    var resposnseBuilt = stringResponse.split('<html')[0] + "<html" + stringResponse.split('<html')[1].split('>')[0] + '>' + `<div id="topThing" style="z-index: 2147483647;
                                    position: absolute;
                                    top: 0px;
                                    left: 50%;"><div style="transform: translateX(-50%); left: 50%; position: absolute; font-size: 25px; top: -56px; background-color: rgba(225,225,225,0.8); height: 125px; width: 320px; border-radius: 20px; text-align: center; font-family: 'Quicksand', sans-serif; "></div><input type="text" id="text3" value="${req.cookies.website}" autocomplete="off" placeholder="Search regents exams" style="transform: translateX(-50%); left: 50%; width: 300px; position: absolute; font-size: 25px; top: 20px; outline: none; border: 4px grey solid; border-radius: 40px; text-align: center; font-family: 'Quicksand', sans-serif; "></input></div>` + stringResponse.split("<html" + stringResponse.split('<html')[1].split('>')[0] + '>')[1]
                                    if (resposnseBuilt.includes('<head')) {
                                        resposnseBuilt.replace("<head", `<head><script type = "text/javascript">' + scriptAdd + "</script>`)
                                    }
                                    resposnseBuilt = resposnseBuilt.split('<html')[0] + "<html" + resposnseBuilt.split('<html')[1].split('>')[0] + '>' + '<script type = "text/javascript">' + scriptAdd + "</script>"  + resposnseBuilt.split("<html" + resposnseBuilt.split('<html')[1].split('>')[0] + '>')[1]
                                    res.status(res2.statusCode).send(resposnseBuilt)
                                } else {
                                    res.status(res2.statusCode).send(Buffer.from(body2, 'binary'))
                                }                        
                            }
                        }
                    } catch(e) {
                        try {
                            res.status(500).send('error')
                        } catch(e) {
                        }
                    }
                })
            } else {
                res.clearCookie("website");
                next()
            }
        }
    } catch(e) {
        try {
            res.status(500).send('error')
        } catch(e) {
        }
    }
})


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get('/sw.js', function(req, res) {
    res.sendFile(__dirname + '/sw.js')
})

module.exports = app